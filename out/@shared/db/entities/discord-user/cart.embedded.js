"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CartEmbedded", {
    enumerable: true,
    get: function() {
        return CartEmbedded;
    }
});
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CartEmbedded = class CartEmbedded {
    static createDefault() {
        return new CartEmbedded({
            channelId: null,
            messageId: null,
            cartItems: [],
            couponCode: null,
            subTotalPrice: 0,
            totalPrice: 0,
            cartCreatedAt: null,
            gatewayMethod: null,
            isOpened: false
        });
    }
    addToCart(item) {
        const existingItemIndex = this.cartItems.findIndex((cartItem)=>cartItem.productId === item.productId && cartItem.productItemId === item.productItemId);
        if (existingItemIndex === -1) {
            this.cartItems.push(item);
        }
        if (!this.isOpened && this.cartItems.length > 0) {
            this.isOpened = true;
            this.cartCreatedAt = new Date();
        }
    }
    async removeFromCart({ productId, productItemId }) {
        this.cartItems = this.cartItems.filter((cartItem)=>!(cartItem.productId === productId && cartItem.productItemId === productItemId));
        if (this.isCartEmpty()) {
            this.isOpened = false;
            this.cartCreatedAt = null;
        }
        await this.discordUser.save();
    }
    async cancelOrder() {
        this.cartItems = [];
        this.channelId = null;
        this.messageId = null;
        this.couponCode = null;
        this.subTotalPrice = 0;
        this.totalPrice = 0;
        this.cartCreatedAt = null;
        this.isOpened = false;
        await this.discordUser.save();
    }
    async updateGatewayMethod(gatewayMethod) {
        this.gatewayMethod = gatewayMethod;
        await this.discordUser.save();
    }
    afterLoad() {
        this.isOpened = Boolean(this.isOpened);
    // this.cartItems = Array.isArray(this.cartItems) ? this.cartItems : JSON.parse(this.cartItems as unknown as string);
    }
    isCartEmpty() {
        return this.cartItems.length === 0;
    }
    constructor(props){
        Object.assign(this, props);
    }
};
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_channelId",
        type: "text",
        nullable: true
    }),
    _ts_metadata("design:type", String)
], CartEmbedded.prototype, "channelId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_messageId",
        type: "text",
        nullable: true
    }),
    _ts_metadata("design:type", String)
], CartEmbedded.prototype, "messageId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_items",
        type: "json",
        nullable: false,
        default: "[]"
    }),
    _ts_metadata("design:type", Array)
], CartEmbedded.prototype, "cartItems", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_ gatewayMethod",
        type: "text",
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CartEmbedded.prototype, "gatewayMethod", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_couponCode",
        type: "text",
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CartEmbedded.prototype, "couponCode", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_subTotalPrice",
        type: "real",
        nullable: false,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], CartEmbedded.prototype, "subTotalPrice", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_totalPrice",
        type: "real",
        nullable: false,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], CartEmbedded.prototype, "totalPrice", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_createdAt",
        type: "datetime",
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CartEmbedded.prototype, "cartCreatedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "cart_isOpened",
        type: "boolean",
        nullable: false,
        default: 0
    }),
    _ts_metadata("design:type", Boolean)
], CartEmbedded.prototype, "isOpened", void 0);
_ts_decorate([
    (0, _typeorm.AfterLoad)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], CartEmbedded.prototype, "afterLoad", null);

//# sourceMappingURL=cart.embedded.js.map