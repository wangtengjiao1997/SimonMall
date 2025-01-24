import { Request, Response } from 'express';
import { Result } from '../../utils/Result';
import {
    getOrderItemService,
    getOrderItemsService,
    updateOrderItemService,
    deleteOrderItemService,
    getMerchantOrderItemsService,
    getUserOrderItemsService
} from './OrderItemService';
import { AuthRequest } from 'src/types/express';

export const getOrderItem = async (req: Request, res: Response) => {
    try {
        const { orderItemId } = req.params;
        const orderItem = await getOrderItemService(orderItemId);
        res.json(Result.success(orderItem));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getOrderItems = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const orderItems = await getOrderItemsService(orderId);
        res.json(Result.success(orderItems));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const updateOrderItem = async (req: AuthRequest, res: Response) => {
    try {
        const { orderItemId } = req.params;
        const { quantity } = req.body;
        const orderItem = await updateOrderItemService(orderItemId, quantity);
        res.json(Result.success(orderItem, '订单项更新成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const deleteOrderItem = async (req: AuthRequest, res: Response) => {
    try {
        const { orderItemId } = req.params;
        await deleteOrderItemService(orderItemId);
        res.json(Result.success(null, '订单项删除成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const getMerchantOrderItems = async (req: AuthRequest, res: Response) => {
    try {
        const { merchantId } = req.params;
        const orderItems = await getMerchantOrderItemsService(merchantId);
        res.json(Result.success(orderItems));
    } catch (error) {
        res.status(500).json(Result.error(error.message));
    }
};

export const getUserOrderItems = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth.userId;
        const orderItems = await getUserOrderItemsService(userId);
        res.json(Result.success(orderItems));
    } catch (error) {
        res.status(500).json(Result.error(error.message));
    }
};