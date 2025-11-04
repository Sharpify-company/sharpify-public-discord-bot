"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Sharpify () {
        return Sharpify;
    },
    get getLocalStoreConfig () {
        return getLocalStoreConfig;
    }
});
const _entities = require("../db/entities");
const _lib = require("../lib");
const _api = /*#__PURE__*/ _interop_require_default(require("./api"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Sharpify = new _api.default({
    baseUrl: _lib.dotEnv.NODE_ENV === "development" ? "http://localhost:5000" : undefined,
    apiKey: _lib.dotEnv.API_TOKEN,
    storeId: _lib.dotEnv.STORE_ID
});
async function getLocalStoreConfig() {
    const storeEntity = await _entities.StoreConfigEntity.findOne({
        where: {
            id: "DEFAULT"
        }
    });
    if (!storeEntity) throw new Error("Store config not found in the local database.");
    return storeEntity;
}

//# sourceMappingURL=index.js.map