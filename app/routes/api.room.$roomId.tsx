import type { LoaderFunction } from "@remix-run/cloudflare";
import type { Env } from "~/types/chat";

export const loader: LoaderFunction = async ({ request, params, context }) => {
    const env = context.env as Env;
    const { roomId } = params;

    if (!roomId) {
        return new Response("Room ID required", { status: 400 });
    }

    try {
        let id;
        // Handle both private and public rooms
        if (roomId.match(/^[0-9a-f]{64}$/)) {
            // Private room - direct ID
            id = env.rooms.idFromString(roomId);
        } else if (roomId.length <= 32) {
            // Public room - named room
            id = env.rooms.idFromName(roomId);
        } else {
            return new Response("Invalid room ID", { status: 400 });
        }

        // Get the Durable Object for this room
        const room = env.rooms.get(id);

        // Forward the request to the Durable Object
        // The DO will handle WebSocket upgrade and message routing
        return room.fetch(request);
    } catch (error) {
        console.error(`Error handling room ${roomId}:`, error);
        return new Response("Internal server error", { status: 500 });
    }
};

// Preflight handler for WebSocket upgrade
export const action: LoaderFunction = async ({ request }) => {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Upgrade, Connection",
            },
        });
    }

    return new Response("Method not allowed", { status: 405 });
};