"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export_star(require("./discord-user/_discord-user.entity"), exports);
_export_star(require("./product/product.entity"), exports);
_export_star(require("./external-events/external-events.entity"), exports);
_export_star(require("./order/order.entity"), exports);
_export_star(require("./store-config/store.config.entity"), exports);
_export_star(require("./emojis/emoji.entity"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}

//# sourceMappingURL=index.js.map