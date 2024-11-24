import { json } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { ChatRoom } from "~/components/Chat/ChatRoom";

export const loader: LoaderFunction = async ({ request, context }) => {
    // Add any data loading logic here
    return json({ });
};

export default function Index() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Chat Rooms</h1>
            <ChatRoom />
        </div>
    );
}