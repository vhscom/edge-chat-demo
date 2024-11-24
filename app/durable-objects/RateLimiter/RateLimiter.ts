import { handleErrors } from '~/utils/errors';
import { validateOrThrow } from '~/utils/validation';
import type { Env } from '~/types/chat';
import {
    rateLimitResponseSchema,
    DEFAULT_RATE_LIMIT_CONFIG
} from './schemas';

export class RateLimiter {
    private nextAllowedTime: number;
    private readonly state: DurableObjectState;
    private readonly env: Env;
    // Define config as a private field with the correct type
    #config = DEFAULT_RATE_LIMIT_CONFIG;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
        this.nextAllowedTime = 0;
    }

    async fetch(request: Request): Promise<Response> {
        return await handleErrors(request, async () => {
            const now = Date.now() / 1000;
            this.nextAllowedTime = Math.max(now, this.nextAllowedTime);

            if (request.method === "POST") {
                this.nextAllowedTime += this.#config.cooldownPeriod;
            }

            const cooldown = Math.max(
                0,
                this.nextAllowedTime - now - this.#config.gracePeriod
            );

            return new Response(
                String(validateOrThrow(rateLimitResponseSchema, cooldown))
            );
        });
    }
}