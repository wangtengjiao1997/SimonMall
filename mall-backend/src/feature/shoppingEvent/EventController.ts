import { Request, Response } from 'express';
import { Result } from '../../utils/Result';
import {
    createEventService,
    getEventService,
    updateEventService,
    deleteEventService,
    getAllEventsService,
    getMerchantEventsService,
} from './EventService';
import { AuthRequest } from 'src/types/express';

export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        const eventData = req.body;
        console.log(eventData);
        const event = await createEventService(eventData);
        res.json(Result.success(event, '活动创建成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const getEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await getEventService(eventId);
        res.json(Result.success(event));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId } = req.params;
        const updateData = req.body;
        const event = await updateEventService(eventId, updateData);
        res.json(Result.success(event, '活动更新成功'));
    } catch (error) {
        res.status(400).json(Result.error(error.message));
    }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId } = req.params;
        await deleteEventService(eventId);
        res.json(Result.success(null, '活动删除成功'));
    } catch (error) {
        res.status(404).json(Result.error(error.message));
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await getAllEventsService();
        res.json(Result.success(events));
    } catch (error) {
        res.status(500).json(Result.error('获取活动列表失败'));
    }
};

export const getMerchantEvents = async (req: Request, res: Response) => {
    try {
        const { merchantId } = req.params;
        const events = await getMerchantEventsService(merchantId);
        res.json(Result.success(events));
    } catch (error) {
        res.status(500).json(Result.error('获取商家活动列表失败'));
    }
};





