export async function handleErrors(request: Request, func: () => Promise<Response>): Promise<Response> {
    try {
        return await func();
    } catch (err) {
        if (request.headers.get("Upgrade") === "websocket") {
            const pair = new WebSocketPair();
            pair[1].accept();
            pair[1].send(JSON.stringify({error: err instanceof Error ? err.stack : String(err)}));
            pair[1].close(1011, "Uncaught exception during session setup");
            return new Response(null, { status: 101, webSocket: pair[0] });
        } else {
            return new Response(err instanceof Error ? err.stack : String(err), {status: 500});
        }
    }
}