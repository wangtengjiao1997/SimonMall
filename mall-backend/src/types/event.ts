export interface EventProductData {
    productId: string;
    price: number;
    quantity: number;
    limitPerUser: number;
}

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TEXT = 'text'
}


export interface EventQuestion {
  type: QuestionType;
  title: string;
  required: boolean;
  options?: string[] | string;  // 选择题的选项
}

export interface CreateEventData {
    merchantId: string;
    eventName: string;
    eventDescription: string;
    startTime: string | Date;
    endTime: string | Date;
    status: string;
    products: EventProductData[];
    questions?: EventQuestion[]; // 新增问题字段
}