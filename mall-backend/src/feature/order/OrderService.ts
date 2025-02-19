import { DeepPartial } from 'typeorm';
import { Order, OrderItem, EventProduct } from '../../entities';
import { AppDataSource } from '../../config/DataSource';
import { SubmitOrder } from '../../types/order';

const orderRepository = AppDataSource.getRepository(Order);
const orderItemRepository = AppDataSource.getRepository(OrderItem);
const eventProductRepository = AppDataSource.getRepository(EventProduct);

export const createOrderService = async (orderData: SubmitOrder) => {
    try {
        return await AppDataSource.manager.transaction(async transactionalEntityManager => {
            // 1. 检查并更新库存
            for (const item of orderData.items) {
                const eventProduct = await transactionalEntityManager.findOne(EventProduct, {
                    where: {
                        eventId: orderData.eventId,
                        productId: item.productId
                    },
                    lock: { mode: 'pessimistic_write' } // 使用悲观锁防止超卖
                });

                if (!eventProduct) {
                    throw new Error(`活动商品不存在: ${item.productId}`);
                }

                if (eventProduct.quantity < item.quantity) {
                    throw new Error(`商品库存不足: ${item.productId}`);
                }

                // 更新库存
                eventProduct.quantity -= item.quantity;
                await transactionalEntityManager.save(eventProduct);
            }

            // 2. 创建订单
            const order = orderRepository.create({
                userId: orderData.userId,
                totalPrice: orderData.totalAmount,
                status: 'pending',
                shippingAddress: orderData.shippingAddress,
                recipientName: orderData.recipientName,
                recipientPhone: orderData.recipientPhone,
                answers: orderData.answers,
                isDeleted: false
            });

            const savedOrder = await transactionalEntityManager.save(order);
            if (!savedOrder) {
                throw new Error('订单创建失败');
            }

            // 3. 创建订单项
            const orderItems = orderData.items.map(item =>
                orderItemRepository.create({
                    orderId: savedOrder.orderId,
                    shoppingEventId: orderData.eventId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    status: 'pending'
                })
            );

            const savedOrderItems = await transactionalEntityManager.save(OrderItem, orderItems);
            if (!savedOrderItems) {
                throw new Error('订单项创建失败');
            }

            return {
                ...savedOrder,
                orderItems: savedOrderItems
            };
        });
    } catch (error) {
        console.error('创建订单详细错误:', {
            error: error,
            stack: error.stack,
            data: orderData
        });
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('未知错误');
        }
    }
};

export const getOrderService = async (orderId: string) => {
    const order = await orderRepository.findOne({
        where: {
            orderId,
            isDeleted: false
        },
        relations: ['orderItems', 'orderItems.shoppingEvent', 'orderItems.product'],
        select: [
            'orderId',
            'userId',
            'totalPrice',
            'status',
            'createdAt',
            'updatedAt'
        ]
    });

    if (!order) {
        throw new Error('订单不存在');
    }

    return order;
};

export const getUserOrdersService = async (userId: string) => {
    return await orderRepository.find({
        where: {
            userId,
            isDeleted: false
        },
        relations: ['orderItems', 'orderItems.shoppingEvent', 'orderItems.product'],
        select: [
            'orderId',
            'userId',
            'totalPrice',
            'status',
            'createdAt',
            'updatedAt'
        ],
        order: {
            createdAt: 'DESC'
        }
    });
};

