import { z } from 'zod';
import type { ErrorResponse } from '~/types/chat';

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
        return schema.parse(data);
    } catch (err) {
        if (err instanceof z.ZodError) {
            throw new Error(`Validation error: ${err.errors.map(e => e.message).join(', ')}`);
        }
        throw err;
    }
}

export function createErrorResponse(error: string): ErrorResponse {
    return { error };
}