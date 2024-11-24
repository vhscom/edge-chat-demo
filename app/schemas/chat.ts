import { z } from 'zod';

// Base schemas
export const usernameSchema = z
    .string()
    .min(1, "Username is required")
    .max(32, "Username must be 32 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens");

export const messageContentSchema = z
    .string()
    .min(1, "Message cannot be empty")
    .max(256, "Message must be 256 characters or less")
    .transform(msg => msg.trim());

export const timestampSchema = z
    .number()
    .int()
    .positive()
    .default(() => Date.now()); // This makes it required with a default value

// Message schemas
export const chatMessageSchema = z.object({
    name: usernameSchema,
    message: messageContentSchema,
    timestamp: z.number().int().positive(), // For messages, we want an explicit timestamp
});

export const systemMessageSchema = z.object({
    type: z.literal('system'),
    content: messageContentSchema,
    timestamp: timestampSchema,
});

export const userJoinedSchema = z.object({
    joined: usernameSchema,
});

export const userLeftSchema = z.object({
    quit: usernameSchema,
});

export const errorMessageSchema = z.object({
    error: z.string(),
});

export const readyMessageSchema = z.object({
    ready: z.literal(true),
});

// Union type for all possible message types
export const websocketMessageSchema = z.discriminatedUnion('type', [
    chatMessageSchema.extend({ type: z.literal('chat') }),
    systemMessageSchema,
    userJoinedSchema.extend({ type: z.literal('join') }),
    userLeftSchema.extend({ type: z.literal('quit') }),
    errorMessageSchema.extend({ type: z.literal('error') }),
    readyMessageSchema.extend({ type: z.literal('ready') }),
]);

// Room schemas
export const roomIdSchema = z.union([
    // Public room names
    z.string()
        .min(1, "Room name is required")
        .max(32, "Room name must be 32 characters or less")
        .regex(/^[a-zA-Z0-9_-]+$/, "Room name can only contain letters, numbers, underscores, and hyphens"),
    // Private room IDs (64 character hex)
    z.string().regex(/^[0-9a-f]{64}$/, "Invalid private room ID"),
]);

// Types
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type WebSocketMessage = z.infer<typeof websocketMessageSchema>;
export type RoomId = z.infer<typeof roomIdSchema>;