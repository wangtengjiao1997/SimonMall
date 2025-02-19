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
    questions: EventQuestion[];
}

export enum QuestionType {
    SINGLE_CHOICE = 'single_choice',
    MULTIPLE_CHOICE = 'multiple_choice',
    TEXT = 'text'
}

// 问题选项接口
export interface QuestionOption {
    content: string;
}

// 活动问题接口
export interface EventQuestion {
    type: QuestionType;
    title: string;
    required: boolean;
    options?: string[];  // 选择题的选项
}

// 问题答案接口
export interface QuestionAnswer {
    type: QuestionType;
    question: string;
    answer: string | string[];
}

// 创建活动的数据接口
export interface CreateEventData {
    merchantId: string;
    eventName: string;
    eventDescription: string;
    startTime: string | Date;
    endTime: string | Date;
    status: string;
    products: EventProduct[];
    questions?: EventQuestion[];
}

// 创建问题时的数据结构
export interface CreateEventQuestion {
    title: string;
    type: QuestionType;
    required: boolean;
    options?: QuestionOption[];
}

// 提交订单时的问题答案
export interface OrderQuestionAnswer {
    eqId: string;
    answer: string | string[];
}
