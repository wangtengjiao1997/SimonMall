import { Request, Response } from 'express';
import { Result } from '../../utils/Result';
import {
    createOrderService,
    getOrderService,
    getUserOrdersService,
} from './OrderService';
import { AuthRequest } from 'src/types/express';

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const orderData = {
            ...req.body,
            userId: req.auth.userId
        };
        const order = await createOrderService(orderData);
        res.json(Result.success(order, '订单创建成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;
        const order = await getOrderService(orderId);
        res.json(Result.success(order));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth.userId;
        const orders = await getUserOrdersService(userId);
        res.json(Result.success(orders));
    } catch (error) {
        res.status(500).json(Result.error('获取订单列表失败'));
    }
};
