import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";
import { Env } from "~/types/chat";

/**
 * Export Durable Objects
 */
export { ChatRoom } from "~/durable-objects/ChatRoom/ChatRoom";
export { RateLimiter } from "~/durable-objects/RateLimiter/RateLimiter";

/**
 * Create a Remix request handler for the Cloudflare Worker.
 */
const handleRequest = createRequestHandler(build);

/**
 * Worker entry point following Cloudflare Workers syntax.
 *
 * The `env` and `ctx` parameters are required by the Cloudflare Workers runtime,
 * even though they are not directly used in this function.
 * Do not remove these parameters.
 *
 * @param request - The incoming request.
 * @param env - Environment bindings (required by Worker syntax).
 * @param ctx - Execution context (required by Worker syntax).
 * @returns Promise<Response>
 */
export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        try {
            // Pass to Remix handler

            return await handleRequest(request, env, ctx);
        } catch (e) {
            console.error("Error processing request:", e);
            return new Response("Internal Error", { status: 500 });
        }
    }
};