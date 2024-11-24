import type { z } from 'zod';
import type {
    chatMessageSchema,
    sessionDataSchema
} from '~/durable-objects/ChatRoom/schemas';

export interface Env {
    rooms: DurableObjectNamespace;
    limiters: DurableObjectNamespace;
    DEBUG?: string;
}

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export interface SessionData {
    limiterId: string;
    blockedMessages: string[];
    name?: string;
    quit?: boolean;
}

export type ErrorResponse = {
    error: string;
};

export type WebSocketMessage =
    | ChatMessage
    | ErrorResponse
    | { joined: string }
    | { quit: string }
    | { ready: true };