import type { Env, ChatMessage, SessionData } from '~/types/chat';
import { validateOrThrow } from '~/utils/validation';
import {
    chatMessageSchema,
    userInfoSchema,
    webSocketAttachmentSchema
} from './schemas';

export class ChatRoom implements DurableObject {
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

        this.initializeWebSockets();
    }

    private initializeWebSockets(): void {
        this.state.getWebSockets().forEach((webSocket) => {
            try {
                const meta = validateOrThrow(
                    webSocketAttachmentSchema,
                    webSocket.deserializeAttachment()
                );

                this.sessions.set(webSocket, {
                    limiterId: meta.limiterId,
                    blockedMessages: []
                });
            } catch (err) {
                console.error("Failed to restore WebSocket session:", err);
                webSocket.close(1011, "Failed to restore session");
            }
        });
    }

    async fetch(request: Request): Promise<Response> {
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

                // Add message event listener
                pair[1].addEventListener("message",
                    event => void this.webSocketMessage(pair[1], event.data));

                await this.handleSession(pair[1], ip);

                return new Response(null, {
                    status: 101,
                    webSocket: pair[0]
                });
            }
            default:
                return new Response("Not found", { status: 404 });
        }
    }

    private async handleSession(webSocket: WebSocket, ip: string): Promise<void> {
        this.state.acceptWebSocket(webSocket);

        const session: SessionData = {
            limiterId: this.env.limiters.idFromName(ip).toString(),
            blockedMessages: []
        };

        webSocket.serializeAttachment({
            limiterId: session.limiterId
        });

        this.sessions.set(webSocket, session);

        // Queue existing users
        for (const otherSession of this.sessions.values()) {
            if (otherSession.name) {
                session.blockedMessages.push(JSON.stringify({ joined: otherSession.name }));
            }
        }

        // Load chat history
        const storage = await this.storage.list<string>({
            reverse: true,
            limit: 100
        });

        const backlog = [...storage.values()];
        backlog.reverse();
        backlog.forEach(value => {
            session.blockedMessages.push(value);
        });
    }

    private async handleMessage(session: SessionData, webSocket: WebSocket, msg: string): Promise<void> {
        const data = validateOrThrow(chatMessageSchema, JSON.parse(msg));

        if (!session.name) {
            // Handle initial user info message
            const userInfo = validateOrThrow(userInfoSchema, data);
            session.name = String(userInfo.name || "anonymous");

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
            if (session.blockedMessages.length > 0) {
                session.blockedMessages.forEach(queued => {
                    webSocket.send(queued);
                });
                session.blockedMessages = [];
            }

            this.broadcast({ joined: session.name });
            webSocket.send(JSON.stringify({ ready: true }));
            return;
        }

        // Ensure message is present
        if (!data.message) {
            throw new Error("Message is required");
        }

        // Handle chat message
        const timestamp = Math.max(Date.now(), this.lastTimestamp + 1);
        const messageData: Required<Pick<ChatMessage, 'name' | 'message' | 'timestamp'>> = {
            name: session.name,
            message: data.message,
            timestamp
        };

        this.lastTimestamp = timestamp;

        const dataStr = JSON.stringify(messageData);
        this.broadcast(dataStr);

        // Store in chat history
        const key = new Date(timestamp).toISOString();
        await this.storage.put(key, dataStr);
    }

    async webSocketMessage(webSocket: WebSocket, msg: string): Promise<void> {
        const session = this.sessions.get(webSocket);
        if (!session) return;

        if (session.quit) {
            webSocket.close(1011, "WebSocket broken.");
            return;
        }

        try {
            await this.handleMessage(session, webSocket, msg);
        } catch (err) {
            webSocket.send(JSON.stringify({
                error: err instanceof Error ? err.message : "An error occurred"
            }));
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

        quitters.forEach(quitter => {
            if (quitter.name) {
                this.broadcast({ quit: quitter.name });
            }
        });
    }
}