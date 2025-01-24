import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import {
    createEventProduct,
    getEventProduct,
    updateEventProduct,
    deleteEventProduct,
    getEventProductsByEventId,
    getProductEvents
} from './EventProductController';

const eventProductRouter = express.Router();

// 活动商品基础操作
eventProductRouter.post('/createEventProduct', requireAuth(), (createEventProduct as unknown) as RequestHandler);
eventProductRouter.get('/getEventProduct/:spId', (getEventProduct as unknown) as RequestHandler);
eventProductRouter.put('/updateEventProduct/:spId', requireAuth(), (updateEventProduct as unknown) as RequestHandler);
eventProductRouter.delete('/deleteEventProduct/:spId', requireAuth(), (deleteEventProduct as unknown) as RequestHandler);

// 查询接口
eventProductRouter.get('/event/:eventId', (getEventProductsByEventId as unknown) as RequestHandler);
eventProductRouter.get('/product/:productId', (getProductEvents as unknown) as RequestHandler);

export default eventProductRouter;