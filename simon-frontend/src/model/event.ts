// 活动信息接口
export interface Event {
    eventId: string;
    merchantId: string;
    eventName: string;
    eventDescription: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    eventProducts: EventProduct[];
}
// 商品信息接口
interface EventProduct {
    epId: string;
    eventId: string;
    productId: string;
    price: string;
    quantity: number;
    limitPerUser: number;
    createdAt: string;
    updatedAt: string;
    product: {
        productId: string;
        merchantId: string;
        name: string;
        description: string;
        price: string;
        category: string;
        imageUrl: string;
        rank: number;
        createdAt: string;
        updatedAt: string;
    };
}
export interface EventWithProducts extends Event {
    eventProducts: EventProduct[];
    merchant: {
        merchantId: string;
        shopName: string;
        shopDescription: string;
    };
}