import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import {
    createOrder,
    getOrder,
    getUserOrders,
} from './OrderController';

const orderRouter = express.Router();

orderRouter.post('/createOrder', requireAuth(), (createOrder as unknown) as RequestHandler);
orderRouter.get('/getOrder/:orderId', requireAuth(), (getOrder as unknown) as RequestHandler);
orderRouter.get('/user/orders', requireAuth(), (getUserOrders as unknown) as RequestHandler);

export default orderRouter;