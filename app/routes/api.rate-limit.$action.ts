import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import type { Env } from "~/types/chat";
import { RATE_LIMITER_PATHS } from "~/durable-objects/RateLimiter/types";

export const action: ActionFunction = async ({ request, params, context }) => {
    const env = context.env as Env;
    const { action } = params;

    // Only allow certain actions from the external API
    if (!action || !["config", "stats", "reset"].includes(action)) {
        return new Response("Not found", { status: 404 });
    }

    // Example: Get rate limiter for an IP
    const ip = request.headers.get("CF-Connecting-IP");
    if (!ip) {
        return new Response("Missing IP", { status: 400 });
    }

    const limiterId = env.limiters.idFromName(ip);
    const limiter = env.limiters.get(limiterId);

    // Forward the request to the appropriate endpoint
    return limiter.fetch(request);
};

// Add loader for GET requests if needed
export const loader: LoaderFunction = async ({ request }) => {
    return new Response("Method not allowed", { status: 405 });
};