import { Request, Response } from 'express';
import { Result } from '../../utils/Result';
import {
    createProductService,
    getProductService,
    updateProductService,
    deleteProductService,
    getAllProductsService,
    getProductsByMerchantService
} from './ProductService';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        const product = await createProductService(productData);
        res.json(Result.success(product, '商品创建成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const product = await getProductService(productId);
        res.json(Result.success(product));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;
        const product = await updateProductService(productId, updateData);
        res.json(Result.success(product, '商品更新成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        await deleteProductService(productId);
        res.json(Result.success(null, '商品删除成功'));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await getAllProductsService();
        res.json(Result.success(products));
    } catch (error) {
        res.status(500).json(Result.error('获取商品列表失败'));
    }
};

export const getProductsByMerchant = async (req: Request, res: Response) => {
    try {
        const { merchantId } = req.params;
        const products = await getProductsByMerchantService(merchantId);
        res.json(Result.success(products));
    } catch (error) {
        res.status(500).json(Result.error('获取商家商品列表失败'));
    }
};