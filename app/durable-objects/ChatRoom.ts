import { handleErrors } from "~/utils/errors";
import type { Env, SessionData, ChatMessage } from "~/types/chat";
import { RateLimiterClient } from "~/durable-objects/RateLimiter";

export class ChatRoom {
    // Mark properties as definitely assigned
    private readonly sessions: Map<WebSocket, SessionData>;
    private lastTimestamp: number;
    private readonly storage: DurableObjectStorage;
    private readonly state: DurableObjectState;
    private readonly env: Env;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.storage = state.storage;
        this.env = env;
        this.sessions = new Map();
        this.lastTimestamp = 0;

        // Initialize existing WebSocket sessions
        this.state.getWebSockets().forEach((webSocket) => {
            try {
                const meta = webSocket.deserializeAttachment() as {
                    limiterId: string;
                    name?: string;
                };

                const limiterId = this.env.limiters.idFromString(meta.limiterId);
                const limiter = new RateLimiterClient(
                    () => this.env.limiters.get(limiterId),
                    (err: Error) => webSocket.close(1011, err.stack)
                );

                this.sessions.set(webSocket, {
                    ...meta,
                    limiter,
                    blockedMessages: []
                });
            } catch (err) {
                // Handle any deserialization errors
                console.error("Failed to restore WebSocket session:", err);
                webSocket.close(1011, "Failed to restore session");
            }
        });
    }

    async fetch(request: Request): Promise<Response> {
        return await handleErrors(request, async () => {
            const url = new URL(request.url);

            switch (url.pathname) {
                case "/websocket": {
                    if (request.headers.get("Upgrade") !== "websocket") {
                        return new Response("Expected WebSocket upgrade", { status: 400 });
                    }

                    const ip = request.headers.get("CF-Connecting-IP");
                    if (!ip) {
                        return new Response("Missing client IP", { status: 400 });
                    }

                    const pair = new WebSocketPair();
                    await this.handleSession(pair[1], ip);

                    return new Response(null, {
                        status: 101,
                        webSocket: pair[0]
                    });
                }
                default:
                    return new Response("Not found", { status: 404 });
            }
        });
    }

    private async handleSession(webSocket: WebSocket, ip: string): Promise<void> {
        this.state.acceptWebSocket(webSocket);

        const limiterId = this.env.limiters.idFromName(ip);
        const limiter = new RateLimiterClient(
            () => this.env.limiters.get(limiterId),
            (err: Error) => webSocket.close(1011, err.stack)
        );

        const session: SessionData = {
            limiterId: limiterId.toString(),
            limiter,
            blockedMessages: []
        };

        webSocket.serializeAttachment({
            limiterId: limiterId.toString()
        });

        this.sessions.set(webSocket, session);

        // Queue existing users for the new session
        for (const otherSession of this.sessions.values()) {
            if (otherSession.name) {
                session.blockedMessages.push(JSON.stringify({ joined: otherSession.name }));
            }
        }

        // Load chat history
        try {
            const storage = await this.storage.list<string>({
                reverse: true,
                limit: 100
            });

            const backlog = [...storage.values()];
            backlog.reverse();
            backlog.forEach(value => {
                session.blockedMessages.push(value);
            });
        } catch (err) {
            console.error("Failed to load chat history:", err);
            webSocket.send(JSON.stringify({
                error: "Failed to load chat history"
            }));
        }
    }

    async webSocketMessage(webSocket: WebSocket, msg: string): Promise<void> {
        try {
            const session = this.sessions.get(webSocket);
            if (!session) {
                throw new Error("Session not found");
            }

            if (session.quit) {
                webSocket.close(1011, "WebSocket broken.");
                return;
            }

            if (!session.limiter.checkLimit()) {
                webSocket.send(JSON.stringify({
                    error: "Your IP is being rate-limited, please try again later."
                }));
                return;
            }

            const data = JSON.parse(msg) as ChatMessage;

            if (!session.name) {
                // Handle initial user info message
                session.name = String(data.name || "anonymous");

                webSocket.serializeAttachment({
                    ...webSocket.deserializeAttachment(),
                    name: session.name
                });

                if (session.name.length > 32) {
                    webSocket.send(JSON.stringify({ error: "Name too long." }));
                    webSocket.close(1009, "Name too long.");
                    return;
                }

                // Send queued messages
                session.blockedMessages.forEach(queued => {
                    webSocket.send(queued);
                });
                delete session.blockedMessages;

                this.broadcast({ joined: session.name });
                webSocket.send(JSON.stringify({ ready: true }));
                return;
            }

            // Handle chat message
            if (!data.message || typeof data.message !== "string") {
                throw new Error("Invalid message format");
            }

            if (data.message.length > 256) {
                webSocket.send(JSON.stringify({ error: "Message too long." }));
                return;
            }

            const messageData: ChatMessage = {
                name: session.name,
                message: data.message,
                timestamp: Math.max(Date.now(), this.lastTimestamp + 1)
            };

            this.lastTimestamp = messageData.timestamp;

            const dataStr = JSON.stringify(messageData);
            this.broadcast(dataStr);

            // Store in chat history
            const key = new Date(messageData.timestamp).toISOString();
            await this.storage.put(key, dataStr);

        } catch (err) {
            const error = err instanceof Error ? err.stack : String(err);
            webSocket.send(JSON.stringify({ error }));
        }
    }

    private broadcast(message: string | ChatMessage): void {
        const messageStr = typeof message === "string" ? message : JSON.stringify(message);
        const quitters: SessionData[] = [];

        this.sessions.forEach((session, webSocket) => {
            if (session.name) {
                try {
                    webSocket.send(messageStr);
                } catch (err) {
                    session.quit = true;
                    quitters.push(session);
                    this.sessions.delete(webSocket);
                }
            } else {
                session.blockedMessages.push(messageStr);
            }
        });

        // Handle disconnected sessions
        quitters.forEach(quitter => {
            if (quitter.name) {
                this.broadcast({ quit: quitter.name });
            }
        });
    }

    private async closeOrErrorHandler(webSocket: WebSocket): Promise<void> {
        const session = this.sessions.get(webSocket);
        if (session) {
            session.quit = true;
            this.sessions.delete(webSocket);
            if (session.name) {
                this.broadcast({ quit: session.name });
            }
        }
    }

    async webSocketClose(webSocket: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
        await this.closeOrErrorHandler(webSocket);
    }

    async webSocketError(webSocket: WebSocket, error: Error): Promise<void> {
        await this.closeOrErrorHandler(webSocket);
    }
}