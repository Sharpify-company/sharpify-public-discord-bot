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
    affiliate: {
        associationType: StoreProps.Affiliate.AssociationTypeEnum;
        minWithdrawAmount: number;
    };
    paymentConfigs: StoreProps.PaymentConfig[];
    template: {
        theme: {
            primaryColor: string;
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
    namespace Affiliate {
        const AssociationTypeEnum: {
            readonly MANUAL: "MANUAL";
            readonly AUTOMATIC: "AUTOMATIC";
        };
        type AssociationTypeEnum = keyof typeof AssociationTypeEnum;
    }
    const GatewayMethodsEnum: {
        readonly PIX: "PIX";
    };
    type GatewayMethodsEnum = keyof typeof GatewayMethodsEnum;
    const FeeTypeEnum: {
        readonly FIXED: "FIXED";
        readonly PERCENTAGE: "PERCENTAGE";
    };
    type FeeTypeEnum = keyof typeof FeeTypeEnum;
    type PaymentConfig = {
        gatewayMethod: GatewayMethodsEnum;
        isEnabled: boolean;
        fee: {
            type: FeeTypeEnum;
            enabled: boolean;
            fixedAmount: number;
            percentageAmount: number;
            amount: number;
        };
    };
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
    };
    info: {
        mainImage?: string;
        images: string[];
        title: string;
        description?: string;
        youtubeLink?: string;
    };
    normalItem: ProductProps.ProductItem;
    dynamicItems: ProductProps.ProductItem[];
    readonly: {
        stockQuantityAvailable: number | null;
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

type OrderProps = {
    id: string;
    shortReference: string;
    createdAt: Date;
    lastTimeStatusUpdated: Date;
    pricing: {
        total: number;
        subTotal: number;
    };
    payment: {
        id: string;
        amount: number;
        gateway: {
            expirationDate: Date | null;
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
        };
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
};

type CouponProps = {
    id: string;
    shortReference: string;
    storeId: string;
    code: string;
    amout: number;
    type: CouponProps.DiscountType;
    createdAt: Date;
};
declare namespace CouponProps {
    const DiscountType: {
        readonly FIXED: "FIXED";
        readonly PERCENTAGE: "PERCENTAGE";
    };
    type DiscountType = keyof typeof DiscountType;
}

type ExternalEventsProps = {
    id: string;
    storeId: string;
    status: ExternalEventsProps.StatusEnum;
    eventName: ExternalEventsProps.EventNameEnum;
    contextAggregateId: string;
} & {
    eventName: "PRODUCT_UPDATED" | "PRODUCT_DELETED";
    payload: ProductProps;
};
declare namespace ExternalEventsProps {
    const EventNameEnum: {
        readonly PRODUCT_UPDATED: "PRODUCT_UPDATED";
        readonly PRODUCT_DELETED: "PRODUCT_DELETED";
    };
    type EventNameEnum = keyof typeof EventNameEnum;
    const StatusEnum: {
        readonly PENDING: "PENDING";
        readonly RECEIVED: "RECEIVED";
    };
    type StatusEnum = keyof typeof StatusEnum;
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
    }): Promise<ActionsOutput<{
        products: ProductProps[];
        lastPage: number;
    }>>;
    get(input: {
        id: string;
    }): Promise<ActionsOutput<{
        product: ProductProps;
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

declare class CommomServices {
    private options;
    externalEvents: ExternalEvents;
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

declare class Pricing {
    private options;
    coupon: Coupon;
    constructor(options: SharpifyOptions);
}

declare class Store {
    private options;
    constructor(options: SharpifyOptions);
    getStore(): Promise<ActionsOutput<StoreProps>>;
}

declare class Management {
    private options;
    store: Store;
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
    }): Promise<ActionsOutput<OrderProps>>;
}

declare class Checkout {
    private options;
    order: Order;
    constructor(options: SharpifyOptions);
}

declare class ApiV1 {
    private options;
    catalog: Catalog;
    commomServices: CommomServices;
    pricing: Pricing;
    management: Management;
    checkout: Checkout;
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
    api: Api;
    constructor(options: Omit<SharpifyOptions, "requestHelper">);
}

export { CategoryProps, CouponProps, CustomFieldsProps, ExternalEventsProps, OrderProps, ProductProps, StoreProps, type UserProps, Sharpify as default };
