import { Request, Response } from 'express';
import { Result } from '../../utils/Result';
import {
    createEventProductService,
    getEventProductService,
    updateEventProductService,
    deleteEventProductService,
    getEventProductsByEventIdService,
    getProductEventsService
} from './EventProductService';
import { AuthRequest } from 'src/types/express';

export const createEventProduct = async (req: AuthRequest, res: Response) => {
    try {
        const eventProductData = req.body;
        const eventProduct = await createEventProductService(eventProductData);
        res.json(Result.success(eventProduct, '活动商品创建成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const getEventProduct = async (req: Request, res: Response) => {
    try {
        const { spId } = req.params;
        const eventProduct = await getEventProductService(spId);
        res.json(Result.success(eventProduct));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const updateEventProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { spId } = req.params;
        const updateData = req.body;
        const eventProduct = await updateEventProductService(spId, updateData);
        res.json(Result.success(eventProduct, '活动商品更新成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const deleteEventProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { spId } = req.params;
        await deleteEventProductService(spId);
        res.json(Result.success(null, '活动商品删除成功'));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getEventProductsByEventId = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const eventProducts = await getEventProductsByEventIdService(eventId);
        res.json(Result.success(eventProducts));
    } catch (error) {
        res.status(500).json(Result.error('获取活动商品列表失败'));
    }
};

export const getProductEvents = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const productEvents = await getProductEventsService(productId);
        res.json(Result.success(productEvents));
    } catch (error) {
        res.status(500).json(Result.error('获取商品活动列表失败'));
    }
};