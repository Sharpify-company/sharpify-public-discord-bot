// ws-client.service.ts
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WsClientService", {
    enumerable: true,
    get: function() {
        return WsClientService;
    }
});
const _common = require("@nestjs/common");
const _socketioclient = require("socket.io-client");
const _rxjs = require("rxjs");
const _lib = require("./@shared/lib");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let isLogged = false;
let WsClientService = class WsClientService {
    connect() {
        // Evita múltiplas conexões simultâneas
        if (this.socket?.connected) return;
        this.socket = (0, _socketioclient.io)(this.url, {
            transports: [
                "websocket"
            ],
            query: {
                accessToken: _lib.dotEnv.API_TOKEN,
                connectionType: "STORE"
            },
            auth: {
                token: _lib.dotEnv.API_TOKEN,
                connectionType: "STORE"
            },
            reconnection: false
        });
        this.socket.on("connect", ()=>{
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
        this.socket.on("disconnect", (reason)=>{
            this.failedAttempts++;
            // Só loga depois de 7 falhas seguidas
            if (this.failedAttempts >= this.MAX_FAIL_LOG) {
                console.log(`❌ Socket.IO disconnected ${this.failedAttempts}x seguidas:`, reason);
            }
            this.scheduleReconnect();
        });
        this.socket.on("connect_error", (err)=>{
            this.failedAttempts++;
            if (this.failedAttempts >= this.MAX_FAIL_LOG) {
                console.log(`⚠️ Socket.IO connection error ${this.failedAttempts}x:`, err.message);
            }
            this.scheduleReconnect();
        });
        this.socket.onAny((event, payload)=>{
            this.messages$.next({
                event,
                payload
            });
        });
    }
    scheduleReconnect() {
        if (this.reconnectTimer) return; // já agendado
        this.reconnectTimer = setTimeout(()=>{
            this.reconnectTimer = null;
            this.connect();
        }, this.reconnectTimeout);
    }
    send(event, payload) {
        if (this.socket && this.socket.connected) {
            this.socket.emit(event, payload);
        }
    }
    on(event) {
        return new _rxjs.Observable((subscriber)=>{
            const sub = this.messages$.subscribe((msg)=>{
                if (msg.event === event) {
                    subscriber.next(msg.payload);
                }
            });
            return ()=>sub.unsubscribe();
        });
    }
    onModuleDestroy() {
        this.socket?.disconnect();
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
    }
    constructor(){
        this.socket = null;
        this.reconnectTimeout = 3000; // 3s
        this.reconnectTimer = null;
        this.failedAttempts = 0;
        this.MAX_FAIL_LOG = 15;
        this.url = _lib.dotEnv.NODE_ENV === "development" ? "http://localhost:1000" : "https://ws.sharpify.com.br";
        this.messages$ = new _rxjs.Subject();
        this.connect();
    }
};
WsClientService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], WsClientService);

//# sourceMappingURL=app.ws.service.js.map