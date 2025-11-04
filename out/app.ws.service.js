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
let WsClientService = class WsClientService {
    connect() {
        console.log("Connecting to WS:", this.url);
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
            reconnectionAttempts: Infinity,
            reconnectionDelay: this.reconnectTimeout
        });
        this.socket.on("connect", ()=>{
            console.log("✅ Socket.IO connected!");
        });
        this.socket.on("disconnect", (reason)=>{
            console.log("❌ Socket.IO disconnected:", reason);
            setTimeout(()=>this.connect(), 5000);
        });
        this.socket.on("connect_error", (err)=>{
            console.log("Socket.IO connection error:", err.message);
        });
        this.socket.onAny((event, payload)=>{
            this.messages$.next({
                event,
                payload
            });
        });
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
    }
    constructor(){
        this.socket = null;
        this.reconnectTimeout = 3000; // 3 seconds
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