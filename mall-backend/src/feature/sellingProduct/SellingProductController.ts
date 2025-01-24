import { Request, Response } from 'express';
import { Result } from '../../utils/Result';
import {
    createSellingProductService,
    getSellingProductService,
    updateSellingProductService,
    deleteSellingProductService,
    getSellingProductsByEventIdService,
    getSellingProductsByOrderIdService,
} from './SellingProductService';
import { AuthRequest } from 'src/types/express';

export const createSellingProduct = async (req: AuthRequest, res: Response) => {
    try {
        const sellingProductData = req.body;
        const sellingProduct = await createSellingProductService(sellingProductData);
        res.json(Result.success(sellingProduct, '活动商品创建成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const getSellingProduct = async (req: Request, res: Response) => {
    try {
        const { spId } = req.params;
        const sellingProduct = await getSellingProductService(spId);
        res.json(Result.success(sellingProduct));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const updateSellingProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { spId } = req.params;
        const updateData = req.body;
        const sellingProduct = await updateSellingProductService(spId, updateData);
        res.json(Result.success(sellingProduct, '活动商品更新成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const deleteSellingProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { spId } = req.params;
        await deleteSellingProductService(spId);
        res.json(Result.success(null, '活动商品删除成功'));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getSellingProductsByEventId = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const sellingProducts = await getSellingProductsByEventIdService(eventId);
        res.json(Result.success(sellingProducts));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getSellingProductsByOrderId = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const sellingProducts = await getSellingProductsByOrderIdService(orderId);
        res.json(Result.success(sellingProducts));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};
