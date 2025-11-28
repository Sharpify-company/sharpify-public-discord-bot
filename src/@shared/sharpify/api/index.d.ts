import * as react from 'react';

declare class Failure<F, S> {
    readonly value: F;
    constructor(value: F);
    isFailure(): this is Failure<F, S>;
    isSuccess(): this is Success<F, S>;
}
declare class Success<F, S> {
    readonly value: S;
    constructor(value: S);
    isFailure(): this is Failure<F, S>;
    isSuccess(): this is Success<F, S>;
}
type Either<F, S> = Failure<F, S> | Success<F, S>;

declare class RequestHelper {
    private options;
    constructor(options: {
        baseURL: string;
        storeId: string;
        apiToken: string;
    });
    execute(url: string, props?: RequestHelper.Props | never): Promise<RequestHelper.Output>;
}
declare namespace RequestHelper {
    type Props = {
        method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        body?: Record<string, any>;
        headers?: Record<string, any>;
        query?: Record<string, any>;
        useBaseURL?: boolean;
    };
    type Output = Either<{
        errorName: string;
        status: number;
        isDefaultError: boolean;
        additional?: any;
    }, {
        data: any;
        status: number;
        headers: Record<string, any>;
    }>;
}

type StoreProps = {
    id: string;
    info: {
        name: string;
        description: string;
        image: string | null;
        favicon: string | null;
    };
    url: string;
    settings: {
        forceLoginOnPurchase: boolean;
    };
    affiliate: {
        associationType: StoreProps.Affiliate.AssociationTypeEnum;
        minWithdrawAmount: number;
    };
    paymentConfigs: StoreProps.PaymentConfig[];
    pluginConfigs: StoreProps.PluginsConfig;
    template: {
        theme: {
            primaryColor: string;
            primaryColorRgb: string;
            secondaryColor: string;
            backgroundColor: string;
            borderColor: string;
            textColor: string;
            cardColor: string;
        };
    };
    createdAt: Date;
};
declare namespace StoreProps {
    export namespace Affiliate {
        const AssociationTypeEnum: {
            readonly MANUAL: "MANUAL";
            readonly AUTOMATIC: "AUTOMATIC";
        };
        type AssociationTypeEnum = keyof typeof AssociationTypeEnum;
    }
    export const GatewayMethodsEnum: {
        readonly PIX: "PIX";
        readonly EFI_PAY_PREFERENCE: "EFI_PAY_PREFERENCE";
    };
    export type GatewayMethodsEnum = keyof typeof GatewayMethodsEnum;
    export const FeeTypeEnum: {
        readonly FIXED: "FIXED";
        readonly PERCENTAGE: "PERCENTAGE";
    };
    export type FeeTypeEnum = keyof typeof FeeTypeEnum;
    export type PaymentConfig = {
        gatewayMethod: GatewayMethodsEnum;
        isEnabled: boolean;
        name: string;
        logoURL: string;
        fee: {
            type: FeeTypeEnum;
            enabled: boolean;
            fixedAmount: number;
            percentageAmount: number;
            amount: number;
        };
    };
    export const PluginEnumEnum: {
        readonly GOOGLE_ADS: "GOOGLE_ADS";
        readonly GOOGLE_ANALYTICS: "GOOGLE_ANALYTICS";
        readonly GOOGLE_TAG_MANAGER: "GOOGLE_TAG_MANAGER";
        readonly FACEBOOK_PIXEL: "FACEBOOK_PIXEL";
        readonly CRISP: "CRISP";
    };
    export type PluginEnumEnum = keyof typeof PluginEnumEnum;
    type BasePlugin<TData> = {
        pluginType: PluginEnumEnum;
        isEnabled: boolean;
        config: TData;
    };
    export type PluginsConfig = {
        [PluginEnumEnum.CRISP]: BasePlugin<{
            websiteId: string;
        }>;
        [PluginEnumEnum.GOOGLE_ANALYTICS]: BasePlugin<{
            googleId: string;
        }>;
        [PluginEnumEnum.GOOGLE_TAG_MANAGER]: BasePlugin<{
            gtmId: string;
        }>;
        [PluginEnumEnum.FACEBOOK_PIXEL]: BasePlugin<{
            pixelId: string;
        }>;
    };
    export {  };
}

type CategoryProps = {
    id: string;
    shortReference: string;
    storeId: string;
    name: string;
    slug: string;
    image: string;
    banner: string;
    type: CategoryProps.CategoryType;
    position: number;
    mainCategoryId: string | null;
    mainCategory: CategoryProps | null;
    readonly: {
        productQuantity: number;
        subCategoryQuantity: number;
        allProductQuantity: number;
    };
    createdAt: Date;
};
declare namespace CategoryProps {
    const CategoryType: {
        readonly MAIN_CATEGORY: "MAIN_CATEGORY";
        readonly SUB_CATEGORY: "SUB_CATEGORY";
    };
    type CategoryType = keyof typeof CategoryType;
}

type CustomFieldsProps = {
    id: string;
    shortReference: string;
    createdAt: Date;
    storeId: string;
    productIds: string[];
    customId: string;
    label: string;
    placeholder: string;
    required: boolean;
    type: CustomFieldsProps.FieldTypeEnum;
    minLength: number | null;
    maxLength: number | null;
};
declare namespace CustomFieldsProps {
    const FieldTypeEnum: {
        readonly TEXT: "TEXT";
        readonly NUMBER: "NUMBER";
        readonly PHONE_NUMBER: "PHONE_NUMBER";
        readonly CPF: "CPF";
        readonly ROBLOX: "ROBLOX";
    };
    type FieldTypeEnum = keyof typeof FieldTypeEnum;
}

type ProductProps = {
    id: string;
    shortReference: string;
    storeId: string;
    category: CategoryProps;
    feedbacks: {
        count: number;
        averageRating: number;
        ratingsDistribution: {
            1: {
                count: number;
                percentage: number;
            };
            2: {
                count: number;
                percentage: number;
            };
            3: {
                count: number;
                percentage: number;
            };
            4: {
                count: number;
                percentage: number;
            };
            5: {
                count: number;
                percentage: number;
            };
        };
    };
    customFields: CustomFieldsProps[];
    pricing: {
        type: ProductProps.PricingType;
        oldPrice: number;
        price: number;
        discountPercentage: number;
    };
    settings: {
        viewType: ProductProps.ViewType;
        position: number;
        hideFeedback: boolean;
        hideSales: boolean;
    };
    info: {
        mainImage?: string;
        discordMainImage?: string;
        images: string[];
        title: string;
        description?: string;
        discordDescription?: string;
        youtubeLink?: string;
        slug: string;
    };
    normalItem: ProductProps.ProductItem;
    dynamicItems: ProductProps.ProductItem[];
    readonly: {
        stockQuantityAvailable: number | null;
        hasStockAvailable: boolean;
        isStockUnlimited: boolean;
        highestPrice: number;
        lowestPrice: number;
        salesQuantity: number;
    };
    createdAt: Date;
};
declare namespace ProductProps {
    const ViewType: {
        readonly NORMAL: "NORMAL";
        readonly DYNAMIC: "DYNAMIC";
    };
    type ViewType = keyof typeof ViewType;
    const VisibilityType: {
        readonly PRIVATE: "PRIVATE";
        readonly PUBLIC: "PUBLIC";
        readonly NON_LISTED: "NON_LISTED";
    };
    type VisibilityType = keyof typeof VisibilityType;
    const StockType: {
        readonly LINES: "LINES";
        readonly STATIC: "STATIC";
        readonly FILE: "FILE";
    };
    type StockType = keyof typeof StockType;
    type PricingType = "NORMAL" | "RANGE" | "DISCOUNT";
    type ProductItem = {
        id: string;
        info: {
            title: string;
            image: string;
        };
        inventory: {
            stockQuantity: number | null;
        };
        pricing: {
            type: PricingType;
            oldPrice: number;
            price: number;
            discountPercentage: number;
        };
    };
}

type CouponProps = {
    id: string;
    shortReference: string;
    storeId: string;
    code: string;
    amout: number;
    type: CouponProps.DiscountType;
    useCondition: {
        productIds: string[];
        minAmount: number | null;
    };
    createdAt: Date;
};
declare namespace CouponProps {
    const DiscountType: {
        readonly FIXED: "FIXED";
        readonly PERCENTAGE: "PERCENTAGE";
    };
    type DiscountType = keyof typeof DiscountType;
}

type OrderProps = {
    id: string;
    shortReference: string;
    createdAt: Date;
    lastTimeStatusUpdated: Date;
    feedback: OrderProps.FeedbackProps;
    customer: {
        id: string | undefined;
        hasCustomer: boolean;
        firstName: string;
        lastName: string;
        email: string;
        info?: {
            avatarURL?: string;
            platform: {
                discordId: string | undefined;
            };
        };
    };
    pricing: {
        total: number;
        subTotal: number;
        storeGatewayFee?: {
            type: "FIXED" | "PERCENTAGE";
            fixedAmount: number;
            percentageAmount: number;
        };
    };
    coupon: {
        isApplied: boolean;
        code: string;
        amount: number;
        type: CouponProps.DiscountType;
    };
    payment: {
        id: string;
        amount: number;
        gateway: {
            gatewayMethod: StoreProps.GatewayMethodsEnum;
            expirationDate: Date | null;
            name: string;
            logoURL: string;
            data: {
                hasQrCode: boolean;
                hasExternalLink: boolean;
                code: string;
                qrCode: string;
                paymentLink: string;
            };
        };
    };
    status: OrderProps.Status;
    orderItems: OrderProps.OrderItem[];
};
declare namespace OrderProps {
    type FeedbackProps = {
        status: OrderProps.FeedbackProps.StatusEnum;
        content: string;
        rating: number;
        sentAt: Date;
        author: {
            avatarURL: string;
            fullName: string;
        };
    };
    namespace FeedbackProps {
        const StatusEnum: {
            readonly PENDING: "PENDING";
            readonly SENT: "SENT";
            readonly DISABLED: "DISABLED";
        };
        type StatusEnum = keyof typeof StatusEnum;
    }
    const Status: {
        readonly PENDING: "PENDING";
        readonly CANCELLED: "CANCELLED";
        readonly APPROVED: "APPROVED";
    };
    type Status = keyof typeof Status;
    type OrderItem = {
        id: string;
        createdAt: string;
        quantity: number;
        status: string;
        shortReference: string;
        pricing: {
            unitPrice: number;
            subTotal: number;
            total: number;
            discountAmount: number;
            storeGatewayFeeAmount: number;
        };
        customFields: {
            id: string;
            label: string;
            value: string;
            customId: string;
            type: CustomFieldsProps.FieldTypeEnum;
        }[];
        product: {
            productId: string;
            productItemId: string;
            backup: {
                description: string | null;
                image: string;
                title: string;
                viewType: ProductProps.ViewType;
            };
            itemBackup: {
                image: string | null;
                price: number;
                stockContent: string | string[] | null;
                stockType: ProductProps.StockType | null;
                title: string | null;
            };
        };
    };
}

type UserProps = {
    customerId: string;
    storeId: string;
    email: string;
    username: string;
    avatar: string | null;
    isAffiliate: boolean;
    affiliate: {
        balance: number;
        commission: number;
        cookieExpirationInDays: number;
        isReseller: boolean;
        affiliateCodes: {
            id: string;
            createdAt: Date;
            shortReference: string;
            storeId: string;
            customerId: string;
            code: string;
        }[];
        withdrawInfo?: {
            fullName: string;
            document: string;
            pixKey: string;
        };
        readonly: {
            totalSales: number;
            ordersQuantity: number;
            orderItemsQuantity: number;
        };
    };
    platform: {
        discordId: string | undefined;
    };
};

type ExternalEventsProps = {
    id: string;
    storeId: string;
    status: ExternalEventsProps.StatusEnum;
    eventName: ExternalEventsProps.EventNameEnum;
    contextAggregateId: string;
    payload: ProductProps | OrderProps;
};
declare namespace ExternalEventsProps {
    const EventNameEnum: {
        readonly PRODUCT_UPDATED: "PRODUCT_UPDATED";
        readonly PRODUCT_DELETED: "PRODUCT_DELETED";
        readonly ORDER_APPROVED: "ORDER_APPROVED";
        readonly ORDER_CANCELLED: "ORDER_CANCELLED";
    };
    type EventNameEnum = keyof typeof EventNameEnum;
    const StatusEnum: {
        readonly PENDING: "PENDING";
        readonly RECEIVED: "RECEIVED";
    };
    type StatusEnum = keyof typeof StatusEnum;
}

type AffiliateWithdrawProps = {
    id: string;
    createdAt: Date;
    shortReference: string;
    amount: number;
    storeId: string;
    customerId: string;
    canCancel: boolean;
    withdrawInfo: AffiliateWithdrawProps.WithdrawInfo;
    lastTimeStatusChanged: Date;
    status: AffiliateWithdrawProps.StatusEnum;
    reasonForDecision: string | null;
};
declare namespace AffiliateWithdrawProps {
    const StatusEnum: {
        readonly PENDING: "PENDING";
        readonly CANCELLED: "CANCELLED";
        readonly APPROVED: "APPROVED";
        readonly REJECTED: "REJECTED";
    };
    type StatusEnum = keyof typeof StatusEnum;
    type WithdrawInfo = {
        fullName: string;
        document: string;
        pixKey: string;
    };
}

type ActionsOutput<T = Record<string, any>> = {
    success: true;
    data: T;
} | {
    success: false;
    errorName: string;
    additional?: any;
};

declare class Product {
    private options;
    constructor(options: SharpifyOptions);
    list(input: {
        limit: number;
        page: number;
        title?: string;
        productItemTitle?: string;
        categoryId?: string;
        ids?: string[];
        includeSubCategories?: boolean;
        includeNonListed?: boolean;
    }): Promise<ActionsOutput<{
        products: ProductProps[];
        lastPage: number;
    }>>;
    listSimilarProducts(input: {
        productId: string;
    }): Promise<ActionsOutput<{
        products: ProductProps[];
    }>>;
    get(input: {
        id: string;
        slug?: string;
        idOrSlug?: string;
        includeNonListed?: boolean;
    }): Promise<ActionsOutput<{
        product: ProductProps;
    }>>;
    decreseStock(input: {
        productId: string;
        productItemId: string;
        quantity: number;
    }): Promise<ActionsOutput<{
        stock: string;
        type: ProductProps.StockType;
    }>>;
    listMyResellersProducts(): Promise<ActionsOutput<{
        products: ProductProps[];
    }>>;
}

declare class Catalog {
    private options;
    product: Product;
    constructor(options: SharpifyOptions);
}

declare class ExternalEvents {
    private options;
    constructor(options: SharpifyOptions);
    listPendingEvents(): Promise<ActionsOutput<{
        events: ExternalEventsProps[];
    }>>;
    markAsReceived(input: {
        ids: string[];
    }): Promise<ActionsOutput>;
}

declare class Roblox {
    private options;
    constructor(options: SharpifyOptions);
    getUserByUsername(input: {
        username: string;
    }): Promise<ActionsOutput<{
        id: number;
        name: string;
        displayName: string;
        avatarUrl: string;
    }>>;
}

declare class CommomServices {
    private options;
    externalEvents: ExternalEvents;
    roblox: Roblox;
    constructor(options: SharpifyOptions);
}

declare class Coupon {
    private options;
    constructor(options: SharpifyOptions);
    validateCoupon(input: {
        code: string;
    }): Promise<ActionsOutput<{
        coupon: CouponProps;
    }>>;
}

declare class Affiliate {
    private options;
    constructor(options: SharpifyOptions);
    becomeAffiliate(): Promise<ActionsOutput>;
    leaveAffiliate(): Promise<ActionsOutput>;
    createMyAffiliateCode(input: {
        code: string;
    }): Promise<ActionsOutput>;
    updateMyAffiliateCode(input: {
        code: string;
        affiliateCodeId: string;
    }): Promise<ActionsOutput>;
    deleteMyAffiliateCode(input: {
        affiliateCodeId: string;
    }): Promise<ActionsOutput>;
    listMyWithdraws(input: {
        page: number;
        limit: number;
    }): Promise<ActionsOutput<{
        withdraws: AffiliateWithdrawProps[];
        lastPage: number;
    }>>;
    requestMyWithdraw(input: {
        amount: number;
        withdrawInfo: AffiliateWithdrawProps.WithdrawInfo;
    }): Promise<ActionsOutput>;
    cancelMyWithdraw(input: {
        withdrawId: string;
    }): Promise<ActionsOutput>;
}

declare class Pricing {
    private options;
    coupon: Coupon;
    affiliate: Affiliate;
    constructor(options: SharpifyOptions);
}

declare class Store {
    private options;
    constructor(options: SharpifyOptions);
    getStore(): Promise<ActionsOutput<StoreProps>>;
    getStoreTerms(): Promise<ActionsOutput<{
        terms: string;
    }>>;
}

declare class Auth {
    private options;
    constructor(options: SharpifyOptions);
    getCurrentSession(): Promise<ActionsOutput<UserProps>>;
    oauthChangeCodeForToken(input: {
        code: string;
        platform: "GOOGLE" | "DISCORD";
    }): Promise<ActionsOutput<{
        accessToken: string;
    }>>;
    defaultSendVerificationCodeToEmail(input: {
        email: string;
    }): Promise<ActionsOutput>;
    defaultVerifyCode(input: {
        code: string;
        email: string;
    }): Promise<ActionsOutput<{
        accessToken: string;
    }>>;
}

declare class Management {
    private options;
    store: Store;
    auth: Auth;
    constructor(options: SharpifyOptions);
}

type PlaceOrderInput = {
    storeId: string;
    couponCode: string | null;
    payment: {
        gatewayMethod: StoreProps.GatewayMethodsEnum;
    };
    products: {
        productId: string;
        productItemId: string;
        quantity: number;
        customFields?: Record<string, any>;
    }[];
    customer: {
        email: string;
        firstName?: string;
        lastName?: string;
        sessionId?: string;
        customerId?: string;
    };
    affiliateCode: string | null;
};
type PlaceOrderOutput = {
    orderId: string;
    isApproved: boolean;
    order: OrderProps;
};
declare class Order {
    private options;
    constructor(options: SharpifyOptions);
    placeOrder(input: PlaceOrderInput): Promise<ActionsOutput<PlaceOrderOutput>>;
    getOrder(input: {
        orderId: string;
    }): Promise<ActionsOutput<{
        order: OrderProps;
    }>>;
    customerListMyOrders(input: {
        page: number;
        limit: number;
    }): Promise<ActionsOutput<{
        orders: OrderProps[];
        lastPage: number;
    }>>;
}

declare class Feedback {
    private options;
    constructor(options: SharpifyOptions);
    listProductFeedbacks(input: {
        page: number;
        limit: number;
        productId: string;
        star?: number | string;
    }): Promise<ActionsOutput<{
        feedbacks: OrderProps.FeedbackProps[];
        lastPage: number;
    }>>;
}

declare class Checkout {
    private options;
    order: Order;
    feedback: Feedback;
    constructor(options: SharpifyOptions);
}

declare class Analytics {
    private options;
    constructor(options: SharpifyOptions);
    createSession(input: {
        sessionId: string;
    }): Promise<ActionsOutput<{
        id: string;
    }>>;
}

declare class Ecommerce {
    private options;
    analytics: Analytics;
    constructor(options: SharpifyOptions);
}

declare class ApiV1 {
    private options;
    catalog: Catalog;
    commomServices: CommomServices;
    pricing: Pricing;
    management: Management;
    checkout: Checkout;
    eCommerce: Ecommerce;
    constructor(options: SharpifyOptions);
}

declare class Api {
    private options;
    v1: ApiV1;
    constructor(options: SharpifyOptions);
}

interface SharpifyOptions {
    apiKey: string;
    baseUrl?: string;
    requestHelper: RequestHelper;
    storeId: string;
}
declare class Sharpify {
    private options;
    readonly url: string;
    api: Api;
    constructor(options: Omit<SharpifyOptions, "requestHelper">);
}

declare namespace SharpifyReact {
    const TemplateContext: react.Context<TemplateContext.Props>;
    namespace TemplateContext {
        type Props = {
            store: StoreProps;
            user?: UserProps;
            PROPERTIES_INJECT: any;
            isSsr: boolean;
            sharpifyApi: Sharpify;
        };
    }
    class Failure<F, S> {
        readonly value: F;
        constructor(value: F);
        isFailure(): this is Failure<F, S>;
        isSuccess(): this is Success<F, S>;
    }
    class Success<F, S> {
        readonly value: S;
        constructor(value: S);
        isFailure(): this is Failure<F, S>;
        isSuccess(): this is Success<F, S>;
    }
    type Either<F, S> = Failure<F, S> | Success<F, S>;
    const failure: <F, S>(f: F) => Either<F, S>;
    const success: <F, S>(s?: S) => Either<F, S>;
    type ActionsOutput<T = Record<string, any>> = {
        success: true;
        data: T;
    } | {
        success: false;
        errorName: string;
        additional?: any;
    };
    function getCookies(): any;
    function ReactQueryAdapter<T>(action: Promise<ActionsOutput<T>>): Promise<T>;
    const showComponentIfTruthy: (condition: any, component: (...args: any) => any, variable?: string) => any;
    function showComponentIfFalse(condition: any, component: (...args: any) => any, variable?: string): any;
    function showComponentIfPathnameEquals(equalsPath: string, component: (...args: any) => any): any;
    function showComponentIfPathnameStartsWith(equalsPath: string, component: (...args: any) => any): any;
    function showComponentIfPathnameNotEquals(equalsPath: string, component: (...args: any) => any): any;
    function showComponentIfPathnameNotStartsWith(equalsPath: string, component: (...args: any) => any): any;
    function showComponentIfEquals(value: any, compare: string, component: (...args: any) => any, variablePath: string): any;
    type PageConfigProps = {
        pageTitle?: string;
        INJECT?: ({
            type: "PRODUCTS";
            variableName: string;
            productsIds?: string[];
        } | {
            type: "PRODUCT";
            variableName: string;
            queryByUrlParam?: {
                paramName: string;
                property: "idOrSlug";
                shouldNotFoundPageIfNotFound?: boolean;
            };
        } | {
            type: "ALL_CATEGORIES";
            onlyMainCategories?: boolean;
            onlyWithAtLeastOneProduct?: boolean;
            variableName: string;
        } | {
            type: "CATEGORY";
            variableName: string;
            queryByUrlParam?: {
                paramName: string;
                property: "idOrSlug";
                shouldNotFoundPageIfNotFound?: boolean;
            };
        } | {
            type: "ORDER";
            variableName: string;
            queryByUrlParam?: {
                paramName: string;
                property: "id";
                shouldNotFoundPageIfNotFound?: boolean;
            };
        })[];
    };
}

export { AffiliateWithdrawProps, CategoryProps, CouponProps, CustomFieldsProps, ExternalEventsProps, OrderProps, ProductProps, SharpifyReact, StoreProps, type UserProps, Sharpify as default };
