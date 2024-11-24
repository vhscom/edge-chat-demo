import type { LoaderFunction } from "@remix-run/cloudflare";
import type { Env } from "~/types/chat";

export const loader: LoaderFunction = async ({ params, request, context }) => {
    const env = context.env as Env;
    const { roomId } = params;

    if (!roomId) {
        return new Response("Room ID required", { status: 400 });
    }

    let id: DurableObjectId;
    if (roomId.match(/^[0-9a-f]{64}$/)) {
        id = env.rooms.idFromString(roomId);
    } else if (roomId.length <= 32) {
        id = env.rooms.idFromName(roomId);
    } else {
        return new Response("Invalid room ID", { status: 404 });
    }

    const roomObject = env.rooms.get(id);
    const url = new URL(request.url);
    url.pathname = "/websocket";
    return roomObject.fetch(url, request);
};