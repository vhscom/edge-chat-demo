import { validateOrThrow, createErrorResponse } from '~/utils/validation';
import { handleErrors } from '~/utils/errors';
import type { Env, ChatMessage, SessionData, WebSocketMessage } from '~/types/chat';
import { RateLimiterClient } from '../RateLimiter';
import {
    chatMessageSchema,
    userInfoSchema,
    webSocketAttachmentSchema
} from './schemas';

export class ChatRoom {
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

        this.state.getWebSockets().forEach((webSocket) => {
            try {
                const meta = validateOrThrow(
                    webSocketAttachmentSchema,
                    webSocket.deserializeAttachment()
                );

                const limiterId = this.env.limiters.idFromString(meta.limiterId);
                const limiter = this.createLimiter(limiterId, webSocket);

                this.sessions.set(webSocket, {
                    ...meta,
                    limiter,
                    blockedMessages: []
                });
            } catch (err) {
                console.error("Failed to restore WebSocket session:", err);
                webSocket.close(1011, "Failed to restore session");
            }
        });
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
                this.sendError(webSocket, "Your IP is being rate-limited, please try again later.");
                return;
            }

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
                    this.sendError(webSocket, "Name too long.");
                    webSocket.close(1009, "Name too long.");
                    return;
                }

                // Send queued messages
                if (session.blockedMessages) {
                    session.blockedMessages.forEach(queued => {
                        webSocket.send(queued);
                    });
                    session.blockedMessages = undefined;
                }

                this.broadcast({ joined: session.name });
                webSocket.send(JSON.stringify({ ready: true }));
                return;
            }

            // Handle chat message
            if (!data.message) {
                throw new Error("Message is required");
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
            this.sendError(
                webSocket,
                err instanceof Error ? err.message : "An error occurred"
            );
        }
    }

    private sendError(webSocket: WebSocket, error: string): void {
        webSocket.send(JSON.stringify(createErrorResponse(error)));
    }

    private broadcast(message: string | WebSocketMessage): void {
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
            } else if (session.blockedMessages) {
                session.blockedMessages.push(messageStr);
            }
        });

        quitters.forEach(quitter => {
            if (quitter.name) {
                this.broadcast({ quit: quitter.name });
            }
        });
    }

    // ... rest of the implementation remains the same ...
}