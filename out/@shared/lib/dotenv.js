"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "dotEnv", {
    enumerable: true,
    get: function() {
        return dotEnv;
    }
});
const _dotenv = /*#__PURE__*/ _interop_require_wildcard(require("dotenv"));
const _zod = require("zod");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
_dotenv.config({
    path: process.cwd() + "/.env"
});
const envSchema = _zod.z.object({
    DISCORD_TOKEN: _zod.z.string().min(1, "DISCORD_BOT_TOKEN is required"),
    DISCORD_GUILD_ID: _zod.z.string().min(1, "DISCORD_GUILD_ID is required"),
    STORE_ID: _zod.z.string().min(1, "STORE_ID is required"),
    CHECKOUT_CATEGORY_ID: _zod.z.string().min(1, "CHECKOUT_CATEGORY_ID is required"),
    API_TOKEN: _zod.z.string().min(1, "API_TOKEN is required"),
    DEFAULT_COLOR: _zod.z.string().optional(),
    NODE_ENV: _zod.z.enum([
        "development",
        "production",
        "test"
    ])
});
const dotEnv = envSchema.parse(process.env);

//# sourceMappingURL=dotenv.js.map