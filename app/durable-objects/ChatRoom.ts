import { handleErrors } from "~/utils/errors";
import type { Env, SessionData, ChatMessage } from "~/types/chat";
import { RateLimiterClient } from "./RateLimiter";

export class ChatRoom {
    private sessions: Map<WebSocket, SessionData>;
    private lastTimestamp: number;
    private storage: DurableObjectStorage;
    private state: DurableObjectState;
    private env: Env;

    constructor(state: DurableObjectState, env: Env) {
        // ... Constructor implementation ...
    }

    // ... Rest of the ChatRoom class implementation ...
}