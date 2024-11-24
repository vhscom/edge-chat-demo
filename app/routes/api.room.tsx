import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import type { Env } from "~/types/chat";

export const action: ActionFunction = async ({ request, context }) => {
    const env = context.env as Env;

    if (request.method === "POST") {
        const id = env.rooms.newUniqueId();
        return new Response(id.toString(), {
            headers: {"Access-Control-Allow-Origin": "*"}
        });
    }

    return json({ error: "Method not allowed" }, { status: 405 });
};