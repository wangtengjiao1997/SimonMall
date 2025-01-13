import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductsByMerchant
} from './ProductController';

const productRouter = express.Router();

// 创建商品（需要商家权限）
productRouter.post('/createProduct', requireAuth(), (createProduct as unknown) as RequestHandler);

// 获取单个商品
productRouter.get('/:productId', (getProduct as unknown) as RequestHandler);

// 更新商品（需要商家权限）
productRouter.put('/updateProduct/:productId', requireAuth(), (updateProduct as unknown) as RequestHandler);

// 删除商品（需要商家权限）
productRouter.delete('/deleteProduct/:productId', requireAuth(), (deleteProduct as unknown) as RequestHandler);

// 获取所有商品
productRouter.get('/getAllProducts', (getAllProducts as unknown) as RequestHandler);

// 获取指定商家的所有商品
productRouter.get('/merchant/:merchantId', (getProductsByMerchant as unknown) as RequestHandler);

export default productRouter;