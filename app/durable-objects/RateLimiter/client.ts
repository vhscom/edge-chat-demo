type GetLimiterStub = () => DurableObjectStub;
type ErrorHandler = (err: Error) => void;

export class RateLimiterClient {
    private readonly getLimiterStub: GetLimiterStub;
    private readonly reportError: ErrorHandler;
    private limiter: DurableObjectStub;
    private inCooldown: boolean;

    constructor(getLimiterStub: GetLimiterStub, reportError: ErrorHandler) {
        this.getLimiterStub = getLimiterStub;
        this.reportError = reportError;
        this.limiter = getLimiterStub();
        this.inCooldown = false;
    }

    checkLimit(): boolean {
        if (this.inCooldown) {
            return false;
        }
        this.inCooldown = true;
        void this.callLimiter();
        return true;
    }

    private async callLimiter(): Promise<void> {
        try {
            let response: Response;
            try {
                // Use internal path structure for rate limiter
                response = await this.limiter.fetch("/check", {
                    method: "POST",
                });
            } catch (err) {
                // Handle disconnection by getting a new stub
                this.limiter = this.getLimiterStub();
                response = await this.limiter.fetch("/check", {
                    method: "POST",
                });
            }

            const cooldown = Number(await response.text());
            await new Promise(resolve => setTimeout(resolve, cooldown * 1000));
            this.inCooldown = false;
        } catch (err) {
            this.reportError(err instanceof Error ? err : new Error(String(err)));
        }
    }
}