export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface Order {
    orderId: string;
    merchantId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    createdAt: string;
    updatedAt: string;
}