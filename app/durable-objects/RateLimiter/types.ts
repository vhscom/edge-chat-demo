export const RATE_LIMITER_PATHS = {
    CHECK: "/check",
    CONFIG: "/config",
    STATS: "/stats",
    RESET: "/reset",
} as const;

export type RateLimiterPath = typeof RATE_LIMITER_PATHS[keyof typeof RATE_LIMITER_PATHS];

export interface RateLimiterStats {
    requestCount: number;
    limitHits: number;
    lastReset: number;
}

export interface RateLimiterConfig {
    cooldownPeriod: number;
    gracePeriod: number;
    maxBurst: number;
}

// Future: Add more types for configuration and statistics