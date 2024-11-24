import { handleErrors } from "~/utils/errors";
import type { Env } from "~/types/chat";

export class RateLimiter {
    private nextAllowedTime: number;

    constructor(state: DurableObjectState, env: Env) {
        this.nextAllowedTime = 0;
    }

    async fetch(request: Request): Promise<Response> {
        return await handleErrors(request, async () => {
            const now = Date.now() / 1000;
            this.nextAllowedTime = Math.max(now, this.nextAllowedTime);

            if (request.method === "POST") {
                this.nextAllowedTime += 5;
            }

            const cooldown = Math.max(0, this.nextAllowedTime - now - 20);
            return new Response(String(cooldown));
        });
    }
}