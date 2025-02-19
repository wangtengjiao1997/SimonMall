
enum QuestionType {
    TEXT = 'text',
    MULTIPLE_CHOICE = 'multipleChoice',
    SINGLE_CHOICE = 'singleChoice',
}

export interface OrderItemData {
    eventId: string;
    productId: string;
    quantity: number;
    price: number;
}

export interface QuestionAnswer {
    type: QuestionType;
    question: string;
    answer: string | string[];
}

export interface SubmitOrder {
    eventId: string;
    userId: string;
    totalAmount: number;
    shippingAddress: string;
    recipientName: string;
    recipientPhone: string;
    items: OrderItemData[];
    answers: QuestionAnswer[];
}