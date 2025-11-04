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
    get InputDto () {
        return InputDto;
    },
    get ListProductsCommand () {
        return ListProductsCommand;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _productemmbed = require("./components/_product-emmbed");
const _autocompleteproductinterceptor = require("./auto-complete-product.interceptor");
const _sharpify = require("../../../../@shared/sharpify");
const _turndown = /*#__PURE__*/ _interop_require_default(require("turndown"));
const _selectsetproductonchannel = require("./components/select-set-product-on-channel");
const _createconfigbutton = require("./components/create-config-button");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const turndownService = new _turndown.default();
let InputDto = class InputDto {
};
_ts_decorate([
    (0, _necord.StringOption)({
        name: "titulo",
        description: "Título do produto",
        required: true,
        max_length: 100,
        autocomplete: true
    }),
    _ts_metadata("design:type", String)
], InputDto.prototype, "productId", void 0);
let ListProductsCommand = class ListProductsCommand {
    async onListProducts([interaction], { productId }) {
        const product = await _sharpify.Sharpify.api.v1.catalog.product.get({
            id: productId,
            includeNonListed: true
        });
        if (!product.success) {
            return interaction.reply({
                content: `Error ao buscar produto: ${product.errorName}`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const { CreateProductConfigButton } = await this.createConfigButtonComponent.createButton({
            productId: product.data.product.id
        });
        return interaction.reply({
            embeds: [
                this.productEmmbed.createEmbbed(product.data.product)
            ],
            components: [
                {
                    type: 1,
                    components: [
                        CreateProductConfigButton
                    ]
                },
                this.selectSetProductOnChannel.createSelectChannel({
                    interaction,
                    product: product.data.product
                })
            ],
            flags: [
                "Ephemeral"
            ]
        });
    }
    constructor(productEmmbed, selectSetProductOnChannel, createConfigButtonComponent){
        this.productEmmbed = productEmmbed;
        this.selectSetProductOnChannel = selectSetProductOnChannel;
        this.createConfigButtonComponent = createConfigButtonComponent;
    }
};
_ts_decorate([
    (0, _common.UseInterceptors)(_autocompleteproductinterceptor.ProductAutocompleteInterceptor),
    (0, _necord.SlashCommand)({
        name: "listar-produtos",
        description: "Cria um componente para listar os seus produtos da Sharpify!",
        defaultMemberPermissions: [
            "Administrator"
        ]
    }),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.Options)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.SlashCommandContext === "undefined" ? Object : _necord.SlashCommandContext,
        typeof InputDto === "undefined" ? Object : InputDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ListProductsCommand.prototype, "onListProducts", null);
ListProductsCommand = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productemmbed.ProductEmmbed === "undefined" ? Object : _productemmbed.ProductEmmbed,
        typeof _selectsetproductonchannel.SelectSetProductOnChannel === "undefined" ? Object : _selectsetproductonchannel.SelectSetProductOnChannel,
        typeof _createconfigbutton.CreateConfigButtonComponent === "undefined" ? Object : _createconfigbutton.CreateConfigButtonComponent
    ])
], ListProductsCommand);

//# sourceMappingURL=list-products.command.js.map