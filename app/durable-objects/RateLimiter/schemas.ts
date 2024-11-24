import { z } from 'zod';

export const rateLimitResponseSchema = z.number().min(0);

export const rateLimitConfigSchema = z.object({
    cooldownPeriod: z.number().positive(),
    gracePeriod: z.number().positive(),
});

// Default configuration
export const DEFAULT_RATE_LIMIT_CONFIG = {
    cooldownPeriod: 5, // seconds between allowed messages
    gracePeriod: 20,   // initial grace period in seconds
} as const;