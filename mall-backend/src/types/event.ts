export interface EventProductData {
    productId: string;
    price: number;
    quantity: number;
    limitPerUser: number;
}

export interface CreateEventData {
    merchantId: string;
    eventName: string;
    eventDescription: string;
    startTime: string | Date;
    endTime: string | Date;
    status: string;
    products: EventProductData[];
}