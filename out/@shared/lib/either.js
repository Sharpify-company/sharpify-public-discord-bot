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
    get Failure () {
        return Failure;
    },
    get Success () {
        return Success;
    },
    get failure () {
        return failure;
    },
    get success () {
        return success;
    }
});
let Failure = class Failure {
    isFailure() {
        return true;
    }
    isSuccess() {
        return false;
    }
    constructor(value){
        this.value = value;
    }
};
let Success = class Success {
    isFailure() {
        return false;
    }
    isSuccess() {
        return true;
    }
    constructor(value){
        this.value = value;
    }
};
const failure = (f)=>{
    return new Failure(f);
};
const success = (s)=>{
    return new Success(s);
};

//# sourceMappingURL=either.js.map