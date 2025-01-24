import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import {
    createSellingProduct,
    getSellingProduct,
    updateSellingProduct,
    deleteSellingProduct,
    getSellingProductsByEventId,
    getSellingProductsByOrderId
} from './SellingProductController';

const sellingProductRouter = express.Router();

// 活动商品基础操作
sellingProductRouter.post('/createSellingProduct', requireAuth(), (createSellingProduct as unknown) as RequestHandler);
sellingProductRouter.get('/getSellingProduct/:spId', (getSellingProduct as unknown) as RequestHandler);
sellingProductRouter.put('/updateSellingProduct/:spId', requireAuth(), (updateSellingProduct as unknown) as RequestHandler);
sellingProductRouter.delete('/deleteSellingProduct/:spId', requireAuth(), (deleteSellingProduct as unknown) as RequestHandler);

// 查询接口
sellingProductRouter.get('/event/:eventId/products', (getSellingProductsByEventId as unknown) as RequestHandler);
sellingProductRouter.get('/order/:orderId/products', (getSellingProductsByOrderId as unknown) as RequestHandler);

export default sellingProductRouter;