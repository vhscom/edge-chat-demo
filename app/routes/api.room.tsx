import type { ActionFunction } from "@remix-run/cloudflare";
import type { Env } from "~/types/chat";

export const action: ActionFunction = async ({ request, context }) => {
    const env = context.env as Env;

    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        // Create a new private room using Durable Object
        const id = env.rooms.newUniqueId();

        // Return the room ID with appropriate headers for CORS
        return new Response(id.toString(), {
            headers: {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        console.error("Failed to create room:", error);
        return new Response("Failed to create room", { status: 500 });
    }
};

// Handle preflight requests
export const loader = async ({ request }: { request: Request }) => {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    return new Response("Method not allowed", { status: 405 });
};