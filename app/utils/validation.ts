import { z } from 'zod';

export class ValidationError extends Error {
    constructor(public errors: z.ZodError) {
        super('Validation failed');
        this.name = 'ValidationError';
    }
}

/**
 * Validates data against a schema and throws if invalid
 * @example
 * ```typescript
 * const userSchema = z.object({
 *   name: z.string(),
 *   age: z.number(),
 * });
 *
 * // Will throw if invalid
 * const user = validateOrThrow(userSchema, userData);
 * ```
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(error);
        }
        throw error;
    }
}

/**
 * Validates data against a schema, returning a Result type
 * @example
 * ```typescript
 * const result = safeParse(userSchema, userData);
 * if (result.success) {
 *   const user = result.data;
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
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

/**
 * Validates data against a schema asynchronously
 * @example
 * ```typescript
 * try {
 *   const user = await validateAsync(userSchema, userData);
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.error(error.errors);
 *   }
 * }
 * ```
 */
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