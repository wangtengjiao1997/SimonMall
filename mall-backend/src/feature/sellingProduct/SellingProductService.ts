import { DeepPartial } from 'typeorm';
import { SellingProduct, ShoppingEvent, Product } from '../../entities';
import { AppDataSource } from '../../config/DataSource';

const sellingProductRepository = AppDataSource.getRepository(SellingProduct);
const eventRepository = AppDataSource.getRepository(ShoppingEvent);
const productRepository = AppDataSource.getRepository(Product);

export const createSellingProductService = async (sellingProductData: DeepPartial<SellingProduct>) => {
    // 验证活动和商品是否存在
    const event = await eventRepository.findOne({
        where: { eventId: sellingProductData.eventId }
    });
    if (!event) {
        throw new Error('活动不存在');
    }

    const product = await productRepository.findOne({
        where: { productId: sellingProductData.productId }
    });
    if (!product) {
        throw new Error('商品不存在');
    }

    // 检查是否已经存在相同的活动商品
    const existingSellingProduct = await sellingProductRepository.findOne({
        where: {
            eventId: sellingProductData.eventId,
            productId: sellingProductData.productId
        }
    });
    if (existingSellingProduct) {
        throw new Error('该商品已经在活动中');
    }

    // 创建活动商品
    const sellingProduct = sellingProductRepository.create(sellingProductData);
    return await sellingProductRepository.save(sellingProduct);
};

export const updateSellingProductService = async (spId: string, updateData: Partial<SellingProduct>) => {
    const sellingProduct = await sellingProductRepository.findOne({ where: { spId } });
    if (!sellingProduct) {
        throw new Error('活动商品不存在');
    }

    // 只允许更新特定字段
    const allowedUpdates = ['price', 'quantity'];
    Object.keys(updateData).forEach((key) => {
        if (!allowedUpdates.includes(key)) {
            delete updateData[key as keyof SellingProduct];
        }
    });

    Object.assign(sellingProduct, updateData);
    return await sellingProductRepository.save(sellingProduct);
};

export const deleteSellingProductService = async (spId: string) => {
    const result = await sellingProductRepository.delete({ spId });
    if (result.affected === 0) {
        throw new Error('活动商品不存在');
    }
    return result;
};

// 获取活动商品
export const getSellingProductService = async (spId: string) => {
    const sellingProduct = await sellingProductRepository.findOne({
        where: { spId },
        relations: ['event', 'product'],
        select: [
            'spId',
            'eventId',
            'productId',
            'price',
            'quantity',
            'createdAt',
            'updatedAt'
        ]
    });

    if (!sellingProduct) {
        throw new Error('活动商品不存在');
    }

    return sellingProduct;
};

// 获取活动商品列表
export const getSellingProductsByEventIdService = async (eventId: string) => {
    return await sellingProductRepository.find({
        where: { eventId },
        relations: ['product'],
        select: [
            'spId',
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

export const getSellingProductsByOrderIdService = async (orderId: string) => {
    return await sellingProductRepository.find({
        where: { orderId },
        relations: ['product'],
        select: ['spId', 'productId', 'price', 'quantity', 'createdAt', 'updatedAt']
    });
};
