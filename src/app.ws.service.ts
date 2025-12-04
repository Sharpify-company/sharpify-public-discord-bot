// ws-client.service.ts
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { io, Socket } from "socket.io-client";
import { Subject, Observable } from "rxjs";
import { dotEnv } from "./@shared/lib";

let isLogged = false;

@Injectable()
export class WsClientService implements OnModuleDestroy {
	private socket: Socket | null = null;

	private reconnectTimeout = 3000; // 3s
	private reconnectTimer: NodeJS.Timeout | null = null;

	private failedAttempts = 0;
	private readonly MAX_FAIL_LOG = 15;

	private url = dotEnv.NODE_ENV === "development" ? "http://localhost:1000" : "https://ws.sharpify.com.br";

	private messages$ = new Subject<any>();

	constructor() {
		this.connect();
	}

	private connect() {
		// Evita múltiplas conexões simultâneas
		if (this.socket?.connected) return;

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
			reconnection: false, // IMPORTANTE: vamos controlar manualmente
		});

		this.socket.on("connect", () => {
			// ✅ ZERA falhas quando conecta

			// Só loga se antes estava em falha crítica
			if (this.failedAttempts >= this.MAX_FAIL_LOG) {
				console.log("✅ Socket.IO reconectado após tentativas! Nada mais a relatar. Ta tudo tranquilo!");
			}

			this.failedAttempts = 0;
			!isLogged && console.log("✅ Socket.IO connected!");
			isLogged = true;

			// Cancela qualquer tentativa pendente
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer);
				this.reconnectTimer = null;
			}
		});

		this.socket.on("disconnect", (reason) => {
			this.failedAttempts++;

			// Só loga depois de 7 falhas seguidas
			if (this.failedAttempts >= this.MAX_FAIL_LOG) {
				console.log(`❌ Socket.IO disconnected ${this.failedAttempts}x seguidas:`, reason);
			}

			this.scheduleReconnect();
		});

		this.socket.on("connect_error", (err) => {
			this.failedAttempts++;

			if (this.failedAttempts >= this.MAX_FAIL_LOG) {
				console.log(`⚠️ Socket.IO connection error ${this.failedAttempts}x:`, err.message);
			}

			this.scheduleReconnect();
		});

		this.socket.onAny((event, payload) => {
			this.messages$.next({ event, payload });
		});
	}

	private scheduleReconnect() {
		if (this.reconnectTimer) return; // já agendado

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			this.connect();
		}, this.reconnectTimeout);
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
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
		}
	}
}
