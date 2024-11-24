import type { z } from 'zod';
import type {
    chatMessageSchema,
    sessionDataSchema
} from '~/durable-objects/ChatRoom/schemas';

export interface Env {
    rooms: DurableObjectNamespace;
    limiters: DurableObjectNamespace;
    DEBUG?: string;  // Optional debug flag
}

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type SessionData = z.infer<typeof sessionDataSchema>;

export type ErrorResponse = {
    error: string;
};

export type WebSocketMessage =
    | ChatMessage
    | ErrorResponse
    | { joined: string }
    | { quit: string }
    | { ready: true };