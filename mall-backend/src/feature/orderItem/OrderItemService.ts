import { OrderItem, Order } from '../../entities';
import { AppDataSource } from '../../config/DataSource';
import { QueryFailedError } from 'typeorm';

const orderItemRepository = AppDataSource.getRepository(OrderItem);
const orderRepository = AppDataSource.getRepository(Order);

export const getOrderItemService = async (orderItemId: string) => {
    try {
        const orderItem = await orderItemRepository.findOne({
            where: { orderItemId },
            relations: ['order', 'product', 'shoppingEvent']
        });

        if (!orderItem) {
            throw new Error('订单项不存在');
        }

        return orderItem;
    } catch (error) {
        console.error('获取订单项详细错误:', {
            error,
            stack: error.stack,
            orderItemId
        });
        if (error instanceof QueryFailedError) {
            throw new Error('数据库查询失败');
        }
        throw error;
    }
};

export const getOrderItemsService = async (orderId: string) => {
    try {
        const order = await orderRepository.findOne({
            where: { orderId }
        });

        if (!order) {
            throw new Error('订单不存在');
        }

        return await orderItemRepository.find({
            where: { orderId },
            relations: ['product', 'shoppingEvent'],
            order: {
                createdAt: 'DESC'
            }
        });
    } catch (error) {
        console.error('获取订单项列表详细错误:', {
            error,
            stack: error.stack,
            orderId
        });
        if (error instanceof QueryFailedError) {
            throw new Error('数据库查询失败');
        }
        throw error;
    }
};

export const updateOrderItemService = async (orderItemId: string, quantity: number) => {
    try {
        const orderItem = await orderItemRepository.findOne({
            where: { orderItemId },
            relations: ['order']
        });

        if (!orderItem) {
            throw new Error('订单项不存在');
        }

        if (orderItem.order.status !== 'pending') {
            throw new Error('只能修改待支付订单的商品数量');
        }

        if (quantity <= 0) {
            throw new Error('商品数量必须大于0');
        }

        orderItem.quantity = quantity;
        return await orderItemRepository.save(orderItem);
    } catch (error) {
        console.error('更新订单项详细错误:', {
            error,
            stack: error.stack,
            orderItemId,
            quantity
        });
        if (error instanceof QueryFailedError) {
            throw new Error('数据库更新失败');
        }
        throw error;
    }
};

export const deleteOrderItemService = async (orderItemId: string) => {
    try {
        const orderItem = await orderItemRepository.findOne({
            where: { orderItemId },
            relations: ['order']
        });

        if (!orderItem) {
            throw new Error('订单项不存在');
        }

        if (orderItem.order.status !== 'pending') {
            throw new Error('只能删除待支付订单的商品');
        }

        return await orderItemRepository.remove(orderItem);
    } catch (error) {
        console.error('删除订单项详细错误:', {
            error,
            stack: error.stack,
            orderItemId
        });
        if (error instanceof QueryFailedError) {
            throw new Error('数据库删除失败');
        }
        throw error;
    }
};

export const getMerchantOrderItemsService = async (merchantId: string) => {
    try {
        return await orderItemRepository
            .createQueryBuilder('orderItem')
            .leftJoinAndSelect('orderItem.order', 'order')
            .leftJoinAndSelect('orderItem.product', 'product')
            .leftJoinAndSelect('orderItem.shoppingEvent', 'event')
            .where('product.merchantId = :merchantId', { merchantId })
            .orderBy('orderItem.createdAt', 'DESC')
            .getMany();
    } catch (error) {
        console.error('获取商家订单项列表详细错误:', {
            error,
            stack: error.stack,
            merchantId
        });
        if (error instanceof QueryFailedError) {
            throw new Error('数据库查询失败');
        }
        throw error;
    }
};

export const getUserOrderItemsService = async (userId: string) => {
    try {
        return await orderItemRepository
            .createQueryBuilder('orderItem')
            .leftJoinAndSelect('orderItem.order', 'order')
            .leftJoinAndSelect('orderItem.product', 'product')
            .leftJoinAndSelect('orderItem.shoppingEvent', 'event')
            .where('order.userId = :userId', { userId })
            .andWhere('order.isDeleted = false')
            .orderBy('orderItem.createdAt', 'DESC')
            .getMany();
    } catch (error) {
        console.error('获取用户订单项列表详细错误:', {
            error,
            stack: error.stack,
            userId
        });
        if (error instanceof QueryFailedError) {
            throw new Error('数据库查询失败');
        }
        throw error;
    }
};


