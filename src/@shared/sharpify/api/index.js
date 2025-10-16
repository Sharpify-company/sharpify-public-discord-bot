"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/api/public-api/index.ts
var index_exports = {};
__export(index_exports, {
  CategoryProps: () => CategoryProps,
  CouponProps: () => CouponProps,
  CustomFieldsProps: () => CustomFieldsProps,
  OrderProps: () => OrderProps,
  ProductProps: () => ProductProps,
  StoreProps: () => StoreProps,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/api/public-api/@shared/lib/either.ts
var Failure = class {
  static {
    __name(this, "Failure");
  }
  value;
  constructor(value) {
    this.value = value;
  }
  isFailure() {
    return true;
  }
  isSuccess() {
    return false;
  }
};
var Success = class {
  static {
    __name(this, "Success");
  }
  value;
  constructor(value) {
    this.value = value;
  }
  isFailure() {
    return false;
  }
  isSuccess() {
    return true;
  }
};
var failure = /* @__PURE__ */ __name((f) => {
  return new Failure(f);
}, "failure");
var success = /* @__PURE__ */ __name((s) => {
  return new Success(s);
}, "success");

// src/api/public-api/@shared/helpers/request-helper.ts
var RequestHelper = class {
  static {
    __name(this, "RequestHelper");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async execute(url, props = {
    method: "GET"
  }) {
    const baseURL = new URL(url, this.options.baseURL);
    const headers = {
      "api-token": this.options.apiToken
    };
    if (!props.query) props.query = {
      ...props.query || {}
    };
    props.query.storeId = this.options.storeId;
    if (props.query) {
      for (const [key, value] of Object.entries(props.query).filter((q) => q[1] !== void 0)) {
        baseURL.searchParams.append(key, value);
      }
    }
    try {
      const req = await fetch(baseURL, {
        body: props.body ? props.body instanceof FormData || props.body instanceof File ? props.body : JSON.stringify(props.body) : void 0,
        method: props.method,
        headers,
        credentials: "include"
      });
      const data = await req.json().catch(() => {
        return {};
      });
      if (!req.ok) {
        if (data.error) return failure({
          errorName: data.error.name,
          isDefaultError: true,
          status: req.status,
          additional: data.error
        });
        return failure({
          errorName: "UnknowError",
          status: req.status,
          isDefaultError: false
        });
      }
      let headersObject = {};
      req.headers?.forEach((value, key) => {
        headersObject[key] = value;
      });
      return success({
        data,
        status: req.status,
        headers: headersObject
      });
    } catch (error) {
      return failure({
        errorName: "NetworkError",
        status: 400,
        isDefaultError: false
      });
    }
  }
};

// src/api/public-api/api/v1/catalog/product.ts
var Product = class {
  static {
    __name(this, "Product");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async list(input) {
    const req = await this.options.requestHelper.execute("/api/v1/catalog/product/list-products", {
      method: "GET",
      query: input
    });
    if (req.isFailure()) return {
      success: false,
      errorName: req.value.errorName
    };
    return {
      success: true,
      data: req.value.data
    };
  }
  async get(input) {
    const req = await this.options.requestHelper.execute("/api/v1/catalog/product/get-product", {
      method: "GET",
      query: input
    });
    if (req.isFailure()) return {
      success: false,
      errorName: req.value.errorName
    };
    return {
      success: true,
      data: req.value.data
    };
  }
};

// src/api/public-api/api/v1/catalog/index.ts
var Catalog = class {
  static {
    __name(this, "Catalog");
  }
  options;
  product;
  constructor(options) {
    this.options = options;
    this.product = new Product(options);
  }
};

// src/api/public-api/api/v1/index.ts
var ApiV1 = class {
  static {
    __name(this, "ApiV1");
  }
  options;
  catalog;
  constructor(options) {
    this.options = options;
    this.catalog = new Catalog(options);
  }
};

// src/api/public-api/api/index.ts
var Api = class {
  static {
    __name(this, "Api");
  }
  options;
  v1;
  constructor(options) {
    this.options = options;
    this.v1 = new ApiV1(options);
  }
};

// src/api/public-api/sharpify.ts
var Sharpify = class {
  static {
    __name(this, "Sharpify");
  }
  options;
  api;
  constructor(options) {
    this.options = options;
    const baseURL = options.baseUrl ?? "https://api.sharpify.com.br";
    const requestHelper = new RequestHelper({
      baseURL,
      storeId: options.storeId,
      apiToken: options.apiKey
    });
    this.api = new Api({
      ...options,
      baseUrl: baseURL,
      requestHelper
    });
  }
};

// src/api/public-api/types/v1/store-props.ts
(function(StoreProps2) {
  (function(Affiliate) {
    Affiliate.AssociationTypeEnum = {
      MANUAL: "MANUAL",
      AUTOMATIC: "AUTOMATIC"
    };
  })(StoreProps2.Affiliate || (StoreProps2.Affiliate = {}));
  StoreProps2.GatewayMethodsEnum = {
    PIX: "PIX"
  };
  StoreProps2.FeeTypeEnum = {
    FIXED: "FIXED",
    PERCENTAGE: "PERCENTAGE"
  };
})(StoreProps || (StoreProps = {}));
var StoreProps;

// src/api/public-api/types/v1/category-props.ts
(function(CategoryProps2) {
  CategoryProps2.CategoryType = {
    MAIN_CATEGORY: "MAIN_CATEGORY",
    SUB_CATEGORY: "SUB_CATEGORY"
  };
})(CategoryProps || (CategoryProps = {}));
var CategoryProps;

// src/api/public-api/types/v1/product-props.ts
(function(ProductProps2) {
  ProductProps2.ViewType = {
    NORMAL: "NORMAL",
    DYNAMIC: "DYNAMIC"
  };
  ProductProps2.VisibilityType = {
    PRIVATE: "PRIVATE",
    PUBLIC: "PUBLIC"
  };
  ProductProps2.StockType = {
    LINES: "LINES",
    STATIC: "STATIC",
    FILE: "FILE"
  };
})(ProductProps || (ProductProps = {}));
var ProductProps;

// src/api/public-api/types/v1/order-props.ts
(function(OrderProps2) {
  OrderProps2.Status = {
    PENDING: "PENDING",
    CANCELLED: "CANCELLED",
    APPROVED: "APPROVED"
  };
})(OrderProps || (OrderProps = {}));
var OrderProps;

// src/api/public-api/types/v1/coupon-props.ts
(function(CouponProps2) {
  CouponProps2.DiscountType = {
    FIXED: "FIXED",
    PERCENTAGE: "PERCENTAGE"
  };
})(CouponProps || (CouponProps = {}));
var CouponProps;

// src/api/public-api/types/v1/custom-fields.props.ts
(function(CustomFieldsProps2) {
  CustomFieldsProps2.FieldTypeEnum = {
    TEXT: "TEXT",
    NUMBER: "NUMBER",
    PHONE_NUMBER: "PHONE_NUMBER",
    CPF: "CPF",
    ROBLOX: "ROBLOX"
  };
})(CustomFieldsProps || (CustomFieldsProps = {}));
var CustomFieldsProps;

// src/api/public-api/index.ts
var index_default = Sharpify;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CategoryProps,
  CouponProps,
  CustomFieldsProps,
  OrderProps,
  ProductProps,
  StoreProps
});
