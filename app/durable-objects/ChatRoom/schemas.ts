import { z } from 'zod';

export const chatMessageSchema = z.object({
    name: z.string().optional(),
    message: z.string().max(256).optional(),
    timestamp: z.number().optional(),
    joined: z.string().optional(),
    quit: z.string().optional(),
    error: z.string().optional(),
    ready: z.boolean().optional(),
});

export const userInfoSchema = z.object({
    name: z.string().max(32).optional(),
});

export const sessionDataSchema = z.object({
    limiterId: z.string(),
    limiter: z.any(), // RateLimiterClient can't be validated at runtime
    blockedMessages: z.array(z.string()).optional(),
    name: z.string().max(32).optional(),
    quit: z.boolean().optional(),
});

export const webSocketAttachmentSchema = z.object({
    limiterId: z.string(),
    name: z.string().optional(),
});