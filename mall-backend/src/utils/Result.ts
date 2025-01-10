interface ResultType<T> {
    success: boolean;
    message: string;
    data: T | null;
    code?: string;
}

export class Result {
    static success<T>(data: T, message: string = '操作成功'): ResultType<T> {
        return {
            success: true,
            message,
            data
        };
    }

    static error<T>(message: string = '操作失败', data: T | null = null): ResultType<T> {
        return {
            success: false,
            message,
            data
        };
    }
}
