import { DeepPartial } from 'typeorm';
import { ShoppingEvent, Product, EventProduct } from '../../entities';
import { AppDataSource } from '../../config/DataSource';

const eventRepository = AppDataSource.getRepository(ShoppingEvent);
const productRepository = AppDataSource.getRepository(Product);
const eventProductRepository = AppDataSource.getRepository(EventProduct);

export const createEventProductService = async (eventProductData: DeepPartial<EventProduct>) => {
    // 验证活动和商品是否存在
    const event = await eventRepository.findOne({
        where: { eventId: eventProductData.eventId }
    });
    if (!event) {
        throw new Error('活动不存在');
    }

    const product = await productRepository.findOne({
        where: { productId: eventProductData.productId }
    });
    if (!product) {
        throw new Error('商品不存在');
    }

    // 检查是否已经存在相同的活动商品
    const existingEventProduct = await eventProductRepository.findOne({
        where: {
            eventId: eventProductData.eventId,
            productId: eventProductData.productId
        }
    });
    if (existingEventProduct) {
        throw new Error('该商品已经在活动中');
    }

    // 创建活动商品
    const eventProduct = eventProductRepository.create(eventProductData);
    return await eventProductRepository.save(eventProduct);
};

export const getEventProductService = async (epId: string) => {
    const eventProduct = await eventProductRepository.findOne({
        where: { epId },
        relations: ['event', 'product'],
        select: [
            'epId',
            'eventId',
            'productId',
            'price',
            'quantity',
            'createdAt',
            'updatedAt'
        ]
    });

    if (!eventProduct) {
        throw new Error('活动商品不存在');
    }

    return eventProduct;
};

export const updateEventProductService = async (epId: string, updateData: Partial<EventProduct>) => {
    const eventProduct = await eventProductRepository.findOne({ where: { epId } });
    if (!eventProduct) {
        throw new Error('活动商品不存在');
    }

    // 只允许更新特定字段
    const allowedUpdates = ['price', 'quantity'];
    Object.keys(updateData).forEach(key => {
        if (!allowedUpdates.includes(key)) {
            delete updateData[key as keyof typeof updateData];
        }
    });

    Object.assign(eventProduct, updateData);
    return await eventProductRepository.save(eventProduct);
};

export const deleteEventProductService = async (epId: string) => {
    const result = await eventProductRepository.delete({ epId });
    if (result.affected === 0) {
        throw new Error('活动商品不存在');
    }
    return result;
};

export const getEventProductsByEventIdService = async (eventId: string) => {
    return await eventProductRepository.find({
        where: { eventId },
        relations: ['product'],
        select: [
            'epId',
            'eventId',
            'productId',
            'price',
            'quantity',
            'createdAt',
            'updatedAt'
        ],
        order: {
            createdAt: 'DESC'
        }
    });
};

export const getProductEventsService = async (productId: string) => {
    return await eventProductRepository.find({
        where: { productId },
        relations: ['event'],
        select: [
            'epId',
            'eventId',
            'productId',
            'price',
            'quantity',
            'createdAt',
            'updatedAt'
        ],
        order: {
            createdAt: 'DESC'
        }
    });
};