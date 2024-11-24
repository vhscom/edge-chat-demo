export interface Env {
    rooms: DurableObjectNamespace;
    limiters: DurableObjectNamespace;
}

export interface SessionData {
    limiterId: string;
    limiter: RateLimiterClient;
    blockedMessages: string[];
    name?: string;
    quit?: boolean;
}

export interface ChatMessage {
    name?: string;
    message?: string;
    timestamp?: number;
    joined?: string;
    quit?: string;
    error?: string;
    ready?: boolean;
}