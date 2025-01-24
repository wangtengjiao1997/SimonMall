import { DeepPartial } from 'typeorm';
import { ShoppingEvent, EventProduct } from '../../entities';
import { AppDataSource } from '../../config/DataSource';
import { CreateEventData } from '../../types/event';

const eventRepository = AppDataSource.getRepository(ShoppingEvent);

export const createEventService = async (eventData: CreateEventData) => {
    try {
        return await AppDataSource.transaction(async transactionalEntityManager => {
            // 1. 创建活动
            const event = transactionalEntityManager.create(ShoppingEvent, {
                merchantId: eventData.merchantId,
                eventName: eventData.eventName,
                eventDescription: eventData.eventDescription,
                startTime: new Date(eventData.startTime),
                endTime: new Date(eventData.endTime),
                status: eventData.status
            });

            const savedEvent = await transactionalEntityManager.save(event);
            if (!savedEvent) {
                throw new Error('活动创建失败');
            }
            console.log(savedEvent);
            // 2. 创建活动商品关联
            const eventProducts = eventData.products.map(product =>
                transactionalEntityManager.create(EventProduct, {
                    eventId: savedEvent.eventId,
                    productId: product.productId,
                    price: product.price,
                    quantity: product.quantity,
                    limitPerUser: product.limitPerUser
                })
            );
            const savedEventProducts = await transactionalEntityManager.save(eventProducts);
            if (!savedEventProducts) {
                throw new Error('活动商品创建失败');
            }
            return {
                ...savedEvent,
                eventProducts: savedEventProducts
            };
        });
    } catch (error) {
        console.error('创建活动详细错误:', {
            error: error,
            stack: error.stack,
            data: eventData
        });
        if (error instanceof Error) {
            throw error; // 直接抛出原始错误
        } else {
            throw new Error('未知错误');
        }
    }
};

export const getEventService = async (eventId: string) => {
    const event = await eventRepository.findOne({
        where: { eventId },
        relations: ['eventProducts', 'eventProducts.product']
    });

    if (!event) {
        throw new Error('活动不存在');
    }

    return event;
};

export const updateEventService = async (eventId: string, updateData: Partial<ShoppingEvent>) => {
    const event = await eventRepository.findOne({ where: { eventId } });
    if (!event) {
        throw new Error('活动不存在');
    }
    Object.assign(event, updateData);
    return await eventRepository.save(event);
};

export const deleteEventService = async (eventId: string) => {
    const result = await eventRepository.delete({ eventId });
    if (result.affected === 0) {
        throw new Error('活动不存在');
    }
    return result;
};

export const getAllEventsService = async () => {
    return await eventRepository.find({
        relations: ['eventProducts', 'eventProducts.product'],
        order: {
            startTime: 'DESC'
        }
    });
};

export const getMerchantEventsService = async (merchantId: string) => {
    try {
        return await eventRepository.find({
            where: { merchantId },
            relations: ['eventProducts', 'eventProducts.product'],
            order: {
                startTime: 'DESC'
            }
        });
    } catch (error) {
        console.error('创建活动详细错误:', {
            error: error,
            stack: error.stack
        });
        if (error instanceof Error) {
            throw error; // 直接抛出原始错误
        } else {
            throw new Error('未知错误');
        }
    }
};

