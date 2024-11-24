import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import { Providers } from "~/components/Providers";
import styles from "~/styles/tailwind.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles }
];

export const meta: MetaFunction = () => [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" }
];

export default function App() {
    return (
        <html lang="en">
        <head>
            <Meta />
            <Links />
        </head>
        <body>
        <Providers>
            <Outlet />
        </Providers>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
    );
}