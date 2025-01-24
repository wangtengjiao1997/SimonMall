
import { QueryFailedError } from 'typeorm';
import { Result } from '../utils/Result';
import express from 'express';
export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // 打印请求信息
    console.error('请求错误:', {
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
    });

    // 打印错误详情
    console.error('错误详情:', {
        name: err.name,
        message: err.message,
        stack: err.stack
    });

    // 数据库错误特殊处理
    if (err instanceof QueryFailedError) {
        console.error('数据库错误:', {
            query: err.query,
            parameters: err.parameters,
            driverError: err.driverError
        });
        return res.status(400).json(Result.error(`数据库操作失败: ${err.message}`));
    }

    // 根据错误类型返回不同状态码
    if (err.name === 'ValidationError') {
        return res.status(400).json(Result.error(err.message));
    }

    // 默认返回500
    return res.status(500).json(Result.error(
        process.env.NODE_ENV === 'production'
            ? '服务器内部错误'
            : err.message
    ));
};