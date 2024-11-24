/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

import type { AppLoadContext } from "@remix-run/cloudflare";
import type { Env } from "~/types/chat";

declare module "@remix-run/cloudflare" {
    interface AppLoadContext {
        env: Env;
    }
}

interface WindowWithEnv extends Window {
    ENV: {
        WORKER_ENV: string;
    };
}

declare global {
    interface Window extends WindowWithEnv {}
}