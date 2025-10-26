// ws-client.service.ts
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { io, Socket } from "socket.io-client";
import { Subject, Observable } from "rxjs";
import { dotEnv } from "./@shared/lib";

@Injectable()
export class WsClientService implements OnModuleDestroy {
	private socket: Socket | null = null;
	private reconnectTimeout = 3000; // 3 seconds
	private url = dotEnv.NODE_ENV === "development" ? "http://localhost:1000" : "https://ws.sharpify.com.br";

	private messages$ = new Subject<any>();

	constructor() {
		this.connect();
	}

	private connect() {
		console.log("Connecting to WS:", this.url);

		this.socket = io(this.url, {
			transports: ["websocket"],
			query: {
				accessToken: dotEnv.API_TOKEN,
				connectionType: "STORE",
			},
			auth: {
				token: dotEnv.API_TOKEN,
				connectionType: "STORE",
			},
			reconnectionAttempts: Infinity,
			reconnectionDelay: this.reconnectTimeout,
		});

		this.socket.on("connect", () => {
			console.log("✅ Socket.IO connected!");
		});

		this.socket.on("disconnect", (reason) => {
			console.log("❌ Socket.IO disconnected:", reason);
			setTimeout(() => this.connect(), 5000);
		});

		this.socket.on("connect_error", (err) => {
			console.log("Socket.IO connection error:", err.message);
		});

		this.socket.onAny((event, payload) => {
			this.messages$.next({ event, payload });
		});
	}

	send(event: string, payload: any) {
		if (this.socket && this.socket.connected) {
			this.socket.emit(event, payload);
		}
	}

	on<T = any>(event: string): Observable<T> {
		return new Observable<T>((subscriber) => {
			const sub = this.messages$.subscribe((msg) => {
				if (msg.event === event) {
					subscriber.next(msg.payload);
				}
			});

			return () => sub.unsubscribe();
		});
	}

	onModuleDestroy() {
		this.socket?.disconnect();
	}
}
