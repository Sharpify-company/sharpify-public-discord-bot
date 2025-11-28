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
  AffiliateWithdrawProps: () => AffiliateWithdrawProps,
  CategoryProps: () => CategoryProps,
  CouponProps: () => CouponProps,
  CustomFieldsProps: () => CustomFieldsProps,
  ExternalEventsProps: () => ExternalEventsProps,
  OrderProps: () => OrderProps,
  ProductProps: () => ProductProps,
  SharpifyReact: () => SharpifyReact,
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
      "api-token": this.options.apiToken,
      customer_access_token: SharpifyReact.getCookies().customerAccessToken,
      "Content-Type": "application/json"
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
        body: props.body ? JSON.stringify({
          ...props.body,
          storeId: this.options.storeId
        }) : void 0,
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
  async listSimilarProducts(input) {
    const req = await this.options.requestHelper.execute("/api/v1/catalog/product/get-similar-products", {
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
  async decreseStock(input) {
    const req = await this.options.requestHelper.execute("/catalog/product/decrease-stock", {
      method: "POST",
      body: input
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
  async listMyResellersProducts() {
    const req = await this.options.requestHelper.execute("/api/v1/catalog/product/list-resellers-products", {
      method: "GET"
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

// src/api/public-api/api/v1/commom-services/external-events.ts
var ExternalEvents = class {
  static {
    __name(this, "ExternalEvents");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async listPendingEvents() {
    const req = await this.options.requestHelper.execute("/commom-services/external-integration-events/list-all-pending-events", {
      method: "GET"
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
  async markAsReceived(input) {
    const req = await this.options.requestHelper.execute("/commom-services/external-integration-events/mark-as-received", {
      method: "POST",
      body: input
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

// src/api/public-api/api/v1/commom-services/roblox.ts
var Roblox = class {
  static {
    __name(this, "Roblox");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async getUserByUsername(input) {
    const req = await this.options.requestHelper.execute(`/api/v1/commom-services/roblox/users/${input.username}`, {
      method: "GET"
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

// src/api/public-api/api/v1/commom-services/index.ts
var CommomServices = class {
  static {
    __name(this, "CommomServices");
  }
  options;
  externalEvents;
  roblox;
  constructor(options) {
    this.options = options;
    this.externalEvents = new ExternalEvents(options);
    this.roblox = new Roblox(options);
  }
};

// src/api/public-api/api/v1/pricing/coupon.ts
var Coupon = class {
  static {
    __name(this, "Coupon");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async validateCoupon(input) {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/coupon/validate-coupon", {
      method: "POST",
      body: {
        ...input,
        storeId: this.options.storeId
      }
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

// src/api/public-api/api/v1/pricing/affiliate.ts
var Affiliate = class {
  static {
    __name(this, "Affiliate");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async becomeAffiliate() {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/affiliate/become-affiliate", {
      method: "POST",
      body: {
        storeId: this.options.storeId
      }
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
  async leaveAffiliate() {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/affiliate/leave-affiliate", {
      method: "POST",
      body: {
        storeId: this.options.storeId
      }
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
  async createMyAffiliateCode(input) {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/affiliate/code/create-affiliate-code", {
      method: "POST",
      body: {
        ...input,
        storeId: this.options.storeId
      }
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
  async updateMyAffiliateCode(input) {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/affiliate/code/update-affiliate-code", {
      method: "POST",
      body: {
        ...input,
        storeId: this.options.storeId
      }
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
  async deleteMyAffiliateCode(input) {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/affiliate/code/delete-affiliate-code", {
      method: "POST",
      body: {
        ...input,
        storeId: this.options.storeId
      }
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
  async listMyWithdraws(input) {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/affiliate/withdraw/list-withdraws", {
      method: "GET",
      query: {
        ...input
      }
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
  async requestMyWithdraw(input) {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/affiliate/withdraw/request-withdraw", {
      method: "POST",
      body: {
        ...input
      }
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
  async cancelMyWithdraw(input) {
    const req = await this.options.requestHelper.execute("/api/v1/pricing/affiliate/withdraw/cancel-withdraw", {
      method: "POST",
      body: {
        ...input
      }
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

// src/api/public-api/api/v1/pricing/index.ts
var Pricing = class {
  static {
    __name(this, "Pricing");
  }
  options;
  coupon;
  affiliate;
  constructor(options) {
    this.options = options;
    this.coupon = new Coupon(options);
    this.affiliate = new Affiliate(options);
  }
};

// src/api/public-api/api/v1/management/store.ts
var Store = class {
  static {
    __name(this, "Store");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async getStore() {
    const req = await this.options.requestHelper.execute("/management/store/get-template-store", {
      method: "GET"
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
  async getStoreTerms() {
    const req = await this.options.requestHelper.execute("/management/store/get-template-store-terms", {
      method: "GET",
      query: {
        storeId: this.options.storeId
      }
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

// src/api/public-api/api/v1/management/auth.ts
var Auth = class {
  static {
    __name(this, "Auth");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async getCurrentSession() {
    const req = await this.options.requestHelper.execute("/api/v1/management/auth/session/current-session", {
      method: "GET"
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
  async oauthChangeCodeForToken(input) {
    const req = await this.options.requestHelper.execute(`/api/v1/management/auth/oauth/${input.platform}/change-code-for-token`, {
      method: "POST",
      body: input
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
  async defaultSendVerificationCodeToEmail(input) {
    const req = await this.options.requestHelper.execute(`/api/v1/management/auth/default/send-verification-code-to-email`, {
      method: "POST",
      body: {
        ...input,
        storeId: this.options.storeId
      }
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
  async defaultVerifyCode(input) {
    const req = await this.options.requestHelper.execute(`/api/v1/management/auth/default/verify-code`, {
      method: "POST",
      body: {
        ...input,
        storeId: this.options.storeId
      }
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

// src/api/public-api/api/v1/management/index.ts
var Management = class {
  static {
    __name(this, "Management");
  }
  options;
  store;
  auth;
  constructor(options) {
    this.options = options;
    this.store = new Store(options);
    this.auth = new Auth(options);
  }
};

// src/api/public-api/api/v1/checkout/order.ts
var Order = class {
  static {
    __name(this, "Order");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async placeOrder(input) {
    const req = await this.options.requestHelper.execute("/checkout/order/place-order", {
      method: "POST",
      body: {
        ...input,
        storeId: this.options.storeId
      }
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
  async getOrder(input) {
    const req = await this.options.requestHelper.execute("/api/v1/checkout/order/get-order", {
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
  async customerListMyOrders(input) {
    const req = await this.options.requestHelper.execute("/api/v1/checkout/order/list-my-orders", {
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

// src/api/public-api/api/v1/checkout/feedback.ts
var Feedback = class {
  static {
    __name(this, "Feedback");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async listProductFeedbacks(input) {
    const req = await this.options.requestHelper.execute("/api/v1/checkout/feedback/list-product-feedbacks", {
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

// src/api/public-api/api/v1/checkout/index.ts
var Checkout = class {
  static {
    __name(this, "Checkout");
  }
  options;
  order;
  feedback;
  constructor(options) {
    this.options = options;
    this.order = new Order(options);
    this.feedback = new Feedback(options);
  }
};

// src/api/public-api/api/v1/e-commerce/analytics.ts
var Analytics = class {
  static {
    __name(this, "Analytics");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  async createSession(input) {
    const req = await this.options.requestHelper.execute("/api/v1/e-commerce/analytics/session/create-session", {
      method: "POST",
      body: {
        ...input,
        storeId: this.options.storeId
      }
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

// src/api/public-api/api/v1/e-commerce/index.ts
var Ecommerce = class {
  static {
    __name(this, "Ecommerce");
  }
  options;
  analytics;
  constructor(options) {
    this.options = options;
    this.analytics = new Analytics(options);
  }
};

// src/api/public-api/api/v1/index.ts
var ApiV1 = class {
  static {
    __name(this, "ApiV1");
  }
  options;
  catalog;
  commomServices;
  pricing;
  management;
  checkout;
  eCommerce;
  constructor(options) {
    this.options = options;
    this.catalog = new Catalog(options);
    this.commomServices = new CommomServices(options);
    this.pricing = new Pricing(options);
    this.management = new Management(options);
    this.checkout = new Checkout(options);
    this.eCommerce = new Ecommerce(options);
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
  url;
  api;
  constructor(options) {
    this.options = options;
    const baseURL = options.baseUrl ?? "https://api.sharpify.com.br";
    this.url = baseURL;
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
  (function(Affiliate2) {
    Affiliate2.AssociationTypeEnum = {
      MANUAL: "MANUAL",
      AUTOMATIC: "AUTOMATIC"
    };
  })(StoreProps2.Affiliate || (StoreProps2.Affiliate = {}));
  StoreProps2.GatewayMethodsEnum = {
    PIX: "PIX",
    EFI_PAY_PREFERENCE: "EFI_PAY_PREFERENCE"
  };
  StoreProps2.FeeTypeEnum = {
    FIXED: "FIXED",
    PERCENTAGE: "PERCENTAGE"
  };
  StoreProps2.PluginEnumEnum = {
    GOOGLE_ADS: "GOOGLE_ADS",
    GOOGLE_ANALYTICS: "GOOGLE_ANALYTICS",
    GOOGLE_TAG_MANAGER: "GOOGLE_TAG_MANAGER",
    FACEBOOK_PIXEL: "FACEBOOK_PIXEL",
    CRISP: "CRISP"
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
    PUBLIC: "PUBLIC",
    NON_LISTED: "NON_LISTED"
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
  (function(FeedbackProps) {
    FeedbackProps.StatusEnum = {
      PENDING: "PENDING",
      SENT: "SENT",
      DISABLED: "DISABLED"
    };
  })(OrderProps2.FeedbackProps || (OrderProps2.FeedbackProps = {}));
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

// src/api/public-api/types/v1/external-events.props.ts
(function(ExternalEventsProps2) {
  ExternalEventsProps2.EventNameEnum = {
    PRODUCT_UPDATED: "PRODUCT_UPDATED",
    PRODUCT_DELETED: "PRODUCT_DELETED",
    ORDER_APPROVED: "ORDER_APPROVED",
    ORDER_CANCELLED: "ORDER_CANCELLED"
  };
  ExternalEventsProps2.StatusEnum = {
    PENDING: "PENDING",
    RECEIVED: "RECEIVED"
  };
})(ExternalEventsProps || (ExternalEventsProps = {}));
var ExternalEventsProps;

// src/api/public-api/types/v1/withdraw-props.ts
(function(AffiliateWithdrawProps2) {
  AffiliateWithdrawProps2.StatusEnum = {
    PENDING: "PENDING",
    CANCELLED: "CANCELLED",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED"
  };
})(AffiliateWithdrawProps || (AffiliateWithdrawProps = {}));
var AffiliateWithdrawProps;

// src/api/public-api/index.ts
(function(SharpifyReact2) {
  SharpifyReact2.TemplateContext = typeof window !== "undefined" ? window?.React?.createContext({}) : {};
  let Failure2 = class Failure {
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
  SharpifyReact2.Failure = Failure2;
  let Success2 = class Success {
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
  SharpifyReact2.Success = Success2;
  SharpifyReact2.failure = (f) => {
    return new Failure2(f);
  };
  SharpifyReact2.success = (s) => {
    return new Success2(s);
  };
  function getCookies() {
    if (typeof document === "undefined") {
      return {};
    }
    const cookieString = document.cookie || "";
    const cookies = cookieString.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
    return cookies;
  }
  __name(getCookies, "getCookies");
  SharpifyReact2.getCookies = getCookies;
  async function ReactQueryAdapter(action) {
    const result = await action;
    if (!result.success) throw new Error(result.errorName, {
      cause: result.additional
    });
    return result.data;
  }
  __name(ReactQueryAdapter, "ReactQueryAdapter");
  SharpifyReact2.ReactQueryAdapter = ReactQueryAdapter;
  SharpifyReact2.showComponentIfTruthy = (condition, component, variable = "variable") => {
    if (!window.isSsr) {
      if (!condition) return null;
      return typeof component === "function" ? component() : component;
    }
    const returnItem = typeof component === "function" ? component() : component;
    const React = window.React;
    const ReactDOMServer = window.ReactDOMServer;
    const html = typeof returnItem === "string" ? returnItem : React.isValidElement(returnItem) ? ReactDOMServer.renderToStaticMarkup(returnItem) : "";
    return React.createElement("div", {
      id: "REMOVE_ME",
      dangerouslySetInnerHTML: {
        __html: `
                {{#${variable}}}
                    ${html}
                {{/${variable}}}
            `
      }
    });
  };
  function showComponentIfFalse(condition, component, variable = "variable") {
    if (!window.isSsr) {
      if (condition) return null;
      return typeof component === "function" ? component() : component;
    }
    const returnItem = typeof component === "function" ? component() : component;
    const React = window.React;
    const ReactDOMServer = window.ReactDOMServer;
    const html = typeof returnItem === "string" ? returnItem : React.isValidElement(returnItem) ? ReactDOMServer.renderToStaticMarkup(returnItem) : "";
    return React.createElement("div", {
      id: "REMOVE_ME",
      dangerouslySetInnerHTML: {
        __html: `
                {{^${variable}}}
                    ${html}
                {{/${variable}}}
            `
      }
    });
  }
  __name(showComponentIfFalse, "showComponentIfFalse");
  SharpifyReact2.showComponentIfFalse = showComponentIfFalse;
  function showComponentIfPathnameEquals(equalsPath, component) {
    if (!window.isSsr) {
      if (window.location.pathname !== equalsPath) return null;
      return typeof component === "function" ? component() : component;
    }
    const returnItem = typeof component === "function" ? component() : component;
    const React = window.React;
    const ReactDOMServer = window.ReactDOMServer;
    const html = typeof returnItem === "string" ? returnItem : React.isValidElement(returnItem) ? ReactDOMServer.renderToStaticMarkup(returnItem) : "";
    return React.createElement("div", {
      id: "REMOVE_ME",
      dangerouslySetInnerHTML: {
        __html: `
                {{#showIfPathnameEquals}} ${equalsPath}	| ${html} {{/showIfPathnameEquals}}
            `
      }
    });
  }
  __name(showComponentIfPathnameEquals, "showComponentIfPathnameEquals");
  SharpifyReact2.showComponentIfPathnameEquals = showComponentIfPathnameEquals;
  function showComponentIfPathnameStartsWith(equalsPath, component) {
    if (!window.isSsr) {
      if (!window.location.pathname.startsWith(equalsPath)) return null;
      return typeof component === "function" ? component() : component;
    }
    const returnItem = typeof component === "function" ? component() : component;
    const React = window.React;
    const ReactDOMServer = window.ReactDOMServer;
    const html = typeof returnItem === "string" ? returnItem : React.isValidElement(returnItem) ? ReactDOMServer.renderToStaticMarkup(returnItem) : "";
    return React.createElement("div", {
      id: "REMOVE_ME",
      dangerouslySetInnerHTML: {
        __html: `
                {{#showIfPathnameStartsWith}} ${equalsPath}	| ${html} {{/showIfPathnameStartsWith}}
            `
      }
    });
  }
  __name(showComponentIfPathnameStartsWith, "showComponentIfPathnameStartsWith");
  SharpifyReact2.showComponentIfPathnameStartsWith = showComponentIfPathnameStartsWith;
  function showComponentIfPathnameNotEquals(equalsPath, component) {
    if (!window.isSsr) {
      if (window.location.pathname === equalsPath) return null;
      return typeof component === "function" ? component() : component;
    }
    const returnItem = typeof component === "function" ? component() : component;
    const React = window.React;
    const ReactDOMServer = window.ReactDOMServer;
    const html = typeof returnItem === "string" ? returnItem : React.isValidElement(returnItem) ? ReactDOMServer.renderToStaticMarkup(returnItem) : "";
    return React.createElement("div", {
      id: "REMOVE_ME",
      dangerouslySetInnerHTML: {
        __html: `
                {{#showIfPathnameNotEquals}} ${equalsPath}	| ${html} {{/showIfPathnameNotEquals}}
            `
      }
    });
  }
  __name(showComponentIfPathnameNotEquals, "showComponentIfPathnameNotEquals");
  SharpifyReact2.showComponentIfPathnameNotEquals = showComponentIfPathnameNotEquals;
  function showComponentIfPathnameNotStartsWith(equalsPath, component) {
    if (!window.isSsr) {
      if (window.location.pathname.startsWith(equalsPath)) return null;
      return typeof component === "function" ? component() : component;
    }
    const returnItem = typeof component === "function" ? component() : component;
    const React = window.React;
    const ReactDOMServer = window.ReactDOMServer;
    const html = typeof returnItem === "string" ? returnItem : React.isValidElement(returnItem) ? ReactDOMServer.renderToStaticMarkup(returnItem) : "";
    return React.createElement("div", {
      id: "REMOVE_ME",
      dangerouslySetInnerHTML: {
        __html: `
                {{#showIfPathnameNotStartsWith}} ${equalsPath}	| ${html} {{/showIfPathnameNotStartsWith}}
            `
      }
    });
  }
  __name(showComponentIfPathnameNotStartsWith, "showComponentIfPathnameNotStartsWith");
  SharpifyReact2.showComponentIfPathnameNotStartsWith = showComponentIfPathnameNotStartsWith;
  function showComponentIfEquals(value, compare, component, variablePath) {
    if (!window.isSsr) {
      if (value != compare) return null;
      return typeof component === "function" ? component() : component;
    }
    const returnItem = typeof component === "function" ? component() : component;
    const React = window.React;
    const ReactDOMServer = window.ReactDOMServer;
    const html = typeof returnItem === "string" ? returnItem : React.isValidElement(returnItem) ? ReactDOMServer.renderToStaticMarkup(returnItem) : "";
    return React.createElement("div", {
      id: "REMOVE_ME",
      dangerouslySetInnerHTML: {
        __html: `
                {{#showIfEqualsValue}} ${variablePath} | ${compare} | ${html} {{/showIfEqualsValue}}
            `
      }
    });
  }
  __name(showComponentIfEquals, "showComponentIfEquals");
  SharpifyReact2.showComponentIfEquals = showComponentIfEquals;
})(SharpifyReact || (SharpifyReact = {}));
var index_default = Sharpify;
var SharpifyReact;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AffiliateWithdrawProps,
  CategoryProps,
  CouponProps,
  CustomFieldsProps,
  ExternalEventsProps,
  OrderProps,
  ProductProps,
  SharpifyReact,
  StoreProps
});
