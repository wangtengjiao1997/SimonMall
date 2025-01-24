export interface OrderItemData {
    eventId: string;
    productId: string;
    quantity: number;
    price: number;
}

export interface SubmitOrder {
    eventId: string;
    userId: string;
    totalAmount: number;
    shippingAddress: string;
    recipientName: string;
    recipientPhone: string;
    items: OrderItemData[];
}