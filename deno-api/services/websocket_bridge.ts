import { Logger } from "@deno-library/logger";
import { io, Socket } from "npm:socket.io-client";

type FrontendClient = {
    socket: WebSocket;
    jobId: string | null;
};

export class WebSocketBridge {
    private readonly clients = new Set<FrontendClient>();
    private upstreamSocket: Socket | null = null;

    constructor(
        private readonly logger: Logger,
        private readonly upstreamUrl: string = "http://127.0.0.1:5002",
    ) {}

    start(): void {
        this.connectUpstream();
    }

    handleFrontendUpgrade(req: Request): Response {
        const { socket, response } = Deno.upgradeWebSocket(req);
        const url = new URL(req.url);
        const jobId = url.searchParams.get("job_id");

        const client: FrontendClient = { socket, jobId };

        socket.onopen = () => {
            this.clients.add(client);
            this.logger.debug(
                `Frontend websocket connected (job_id=${jobId ?? "*"}, clients=${this.clients.size})`,
            );
        };

        socket.onclose = () => {
            this.clients.delete(client);
            this.logger.debug(`Frontend websocket disconnected (clients=${this.clients.size})`);
        };

        socket.onerror = () => {
            this.clients.delete(client);
            this.logger.debug(`Frontend websocket errored (clients=${this.clients.size})`);
        };

        return response;
    }

    private connectUpstream(): void {
        if (this.upstreamSocket?.connected) return;

        this.logger.debug(`Connecting to Python Socket.IO: ${this.upstreamUrl}`);

        const socket = io(this.upstreamUrl, {
            transports: ["polling", "websocket"],
            reconnection: true,
            reconnectionDelay: 2000,
            timeout: 8000,
        });

        this.upstreamSocket = socket;

        socket.on("connect", () => {
            this.logger.debug(`Connected to Python Socket.IO`);
        });

        socket.on("disconnect", (reason) => {
            this.logger.debug(`Python Socket.IO disconnected: ${reason}`);
        });

        socket.on("connect_error", (error: Error) => {
            this.logger.debug(`Python Socket.IO connection error: ${error.message}`); //
        });

        socket.io.on("reconnect_attempt", (attempt: number) => {
            this.logger.debug(`Reconnect attempt ${attempt}`);
        });

        const forward = (payload: unknown) =>
            this.forwardToFrontendPayload(payload);

        socket.on("job_update", forward);
        socket.on("live_update", forward);
        socket.on("message", forward);
    }

    private forwardToFrontendPayload(payload: unknown): void {
        if (typeof payload === "string") {
            this.forwardToFrontend(payload);
            return;
        }

        this.forwardToFrontend(JSON.stringify(payload ?? {}));
    }

    private forwardToFrontend(raw: string): void {
        let parsed: Record<string, unknown> | null = null;

        try {
            parsed = JSON.parse(raw);
        } catch {
            // keep raw
        }

        const payload = parsed ?? { message: raw };
        const jobId = typeof payload.job_id === "string" ? payload.job_id : null;
        const wirePayload = JSON.stringify(payload);

        for (const client of this.clients) {
            if (client.socket.readyState !== WebSocket.OPEN) continue;

            if (client.jobId && jobId && client.jobId !== jobId) continue;

            client.socket.send(wirePayload);
        }
    }
}