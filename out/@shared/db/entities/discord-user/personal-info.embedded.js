"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PersonalInfoEmbedded", {
    enumerable: true,
    get: function() {
        return PersonalInfoEmbedded;
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
let PersonalInfoEmbedded = class PersonalInfoEmbedded {
    static createDefault() {
        return new PersonalInfoEmbedded({
            firstName: null,
            lastName: null,
            email: null
        });
    }
    async updateInfo(props) {
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        await this.discordUser.save();
    }
    constructor(props){
        Object.assign(this, props);
    }
};
_ts_decorate([
    (0, _typeorm.Column)({
        name: "personalInfo_firstName",
        type: "text",
        nullable: true
    }),
    _ts_metadata("design:type", String)
], PersonalInfoEmbedded.prototype, "firstName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "personalInfo_lastName",
        type: "text",
        nullable: true
    }),
    _ts_metadata("design:type", String)
], PersonalInfoEmbedded.prototype, "lastName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "personalInfo_email",
        type: "text",
        nullable: true
    }),
    _ts_metadata("design:type", String)
], PersonalInfoEmbedded.prototype, "email", void 0);

//# sourceMappingURL=personal-info.embedded.js.map