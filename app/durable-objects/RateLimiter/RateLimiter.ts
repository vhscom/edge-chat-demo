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
    #config = DEFAULT_RATE_LIMIT_CONFIG;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
        this.nextAllowedTime = 0;
    }

    async fetch(request: Request): Promise<Response> {
        return await handleErrors(request, async () => {
            const url = new URL(request.url);

            switch (url.pathname) {
                case "/check": {
                    if (request.method !== "POST") {
                        return new Response("Method not allowed", { status: 405 });
                    }

                    const now = Date.now() / 1000;
                    this.nextAllowedTime = Math.max(now, this.nextAllowedTime);
                    this.nextAllowedTime += this.#config.cooldownPeriod;

                    const cooldown = Math.max(
                        0,
                        this.nextAllowedTime - now - this.#config.gracePeriod
                    );

                    return new Response(
                        String(validateOrThrow(rateLimitResponseSchema, cooldown))
                    );
                }

                case "/config": {
                    // Future: Add configuration endpoint
                    // This could be used to adjust rate limits dynamically
                    return new Response("Not implemented", { status: 501 });
                }

                case "/stats": {
                    // Future: Add statistics endpoint
                    // This could return rate limiting statistics
                    return new Response("Not implemented", { status: 501 });
                }

                case "/reset": {
                    // Future: Add reset endpoint
                    // This could be used to reset rate limits for testing/admin purposes
                    return new Response("Not implemented", { status: 501 });
                }

                default:
                    return new Response("Not found", { status: 404 });
            }
        });
    }
}