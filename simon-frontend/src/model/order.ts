export interface OrderItem {
    productId: string;
    eventId: string;
    price: number;
    quantity: number;
}

export interface Order {
    orderId: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
}

export interface SubmitOrder {
    eventId: string;
    userId: string;
    totalAmount: number;
    shippingAddress: string;
    recipientName: string;
    recipientPhone: string;
    items: OrderItem[];
}

export interface MerchantOrderItem {
    orderItemId: string;
    orderId: string;
    userId: string;
    eventId: string;
    quantity: number;
    price: number;
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
    shoppingEvent: {
        eventId: string;
        merchantId: string;
        eventName: string;
        eventDescription: string;
        startTime: string;
        endTime: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    order: {
        orderId: string;
        userId: string;
        totalPrice: string;
        status: string;
        address: string;
        createdAt: string;
        updatedAt: string;
        recipientName: string;
        recipientPhone: string;
        shippingAddress: string;
    };
    createdAt: string;
    updatedAt: string;
}
