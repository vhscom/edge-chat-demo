import type { MetaFunction } from "@remix-run/cloudflare";
import { Chat } from "~/components/Chat";

export const meta: MetaFunction = () => [
    { title: "Edge Chat Demo" }
];

export default function Index() {
    return <Chat />;
}