import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import {
    getOrderItem,
    getOrderItems,
    updateOrderItem,
    deleteOrderItem,
    getMerchantOrderItems,
    getUserOrderItems
} from './OrderItemController';

const orderItemRouter = express.Router();

orderItemRouter.get('/:orderItemId', (getOrderItem as unknown) as RequestHandler);
orderItemRouter.get('/order/:orderId', (getOrderItems as unknown) as RequestHandler);
orderItemRouter.put('/:orderItemId', requireAuth(), (updateOrderItem as unknown) as RequestHandler);
orderItemRouter.delete('/:orderItemId', requireAuth(), (deleteOrderItem as unknown) as RequestHandler);
orderItemRouter.get('/merchant/:merchantId', requireAuth(), (getMerchantOrderItems as unknown) as RequestHandler);
orderItemRouter.get('/user/items', requireAuth(), (getUserOrderItems as unknown) as RequestHandler);

export default orderItemRouter;