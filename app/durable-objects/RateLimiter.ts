import { handleErrors } from "~/utils/errors";
import type { Env } from "~/types/chat";

export class RateLimiter {
    private nextAllowedTime: number;

    constructor(state: DurableObjectState, env: Env) {
        this.nextAllowedTime = 0;
    }

    // ... Rest of the RateLimiter class implementation ...
}

export class RateLimiterClient {
    // ... RateLimiterClient implementation ...
}