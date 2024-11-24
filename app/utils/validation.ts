import { z } from 'zod';

export class ValidationError extends Error {
    constructor(public errors: z.ZodError) {
        super('Validation failed');
        this.name = 'ValidationError';
    }
}

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(error);
        }
        throw error;
    }
}

export function validateAsync<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): Promise<T> {
    try {
        return schema.parseAsync(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Promise.reject(new ValidationError(error));
        }
        return Promise.reject(error);
    }
}

export function safeParse<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
    const result = schema.safeParse(data);
    if (!result.success) {
        return { success: false, error: new ValidationError(result.error) };
    }
    return result;
}