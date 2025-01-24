import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import {
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getMerchantEvents,
} from './EventController';

const eventRouter = express.Router();

// 活动基础操作
eventRouter.post('/createEvent', requireAuth(), (createEvent as unknown) as RequestHandler);
eventRouter.get('/getEvent/:eventId', (getEvent as unknown) as RequestHandler);
eventRouter.put('/updateEvent/:eventId', requireAuth(), (updateEvent as unknown) as RequestHandler);
eventRouter.delete('/deleteEvent/:eventId', requireAuth(), (deleteEvent as unknown) as RequestHandler);
eventRouter.get('/getAllEvents', (getAllEvents as unknown) as RequestHandler);
eventRouter.get('/merchant/:merchantId', (getMerchantEvents as unknown) as RequestHandler);

export default eventRouter;