import { Request, Response } from 'express';
import { Result } from '../../utils/Result';
import {
    createMerchantService,
    getMerchantService,
    updateMerchantService,
    deleteMerchantService,
    getAllMerchantsService,
    getMerchantByUserIdService
} from './MerchantService';
import { AuthRequest } from 'src/types/express';
export const createMerchant = async (req: AuthRequest, res: Response) => {
    try {
        const merchantData = req.body;
        const userId = req.auth.userId;
        const merchant = await createMerchantService(merchantData, userId);
        res.json(Result.success(merchant, '商家创建成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const getMerchant = async (req: Request, res: Response) => {
    try {
        const { merchantId } = req.params;
        const merchant = await getMerchantService(merchantId);
        res.json(Result.success(merchant));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getMerchantByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const merchant = await getMerchantByUserIdService(userId);
        res.json(Result.success(merchant));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getCurrentUserMerchant = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth.userId;
        const merchant = await getMerchantByUserIdService(userId);
        res.json(Result.success(merchant));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};
export const updateMerchant = async (req: Request, res: Response) => {
    try {
        const { merchantId } = req.params;
        const updateData = req.body;
        const merchant = await updateMerchantService(merchantId, updateData);
        res.json(Result.success(merchant, '商家信息更新成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const deleteMerchant = async (req: Request, res: Response) => {
    try {
        const { merchantId } = req.params;
        await deleteMerchantService(merchantId);
        res.json(Result.success(null, '商家删除成功'));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getAllMerchants = async (req: Request, res: Response) => {
    try {
        const merchants = await getAllMerchantsService();
        res.json(Result.success(merchants));
    } catch (error) {
        res.status(500).json(Result.error('获取商家列表失败'));
    }
};