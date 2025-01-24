export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: string;
}

export interface Order {
    id: string;
    orderId: string;
    status: 'pending' | 'completed' | 'cancelled';
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}