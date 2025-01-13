import { DeepPartial } from 'typeorm';
import { Merchant, Product } from '../../entities';
import { AppDataSource } from '../../config/DataSource';

const merchantRepository = AppDataSource.getRepository(Merchant);
const productRepository = AppDataSource.getRepository(Product);

export const createMerchantService = async (merchantData: DeepPartial<Merchant>) => {
    // 创建新商家
    const merchant = merchantRepository.create({
        ...merchantData,
        shopStatus: 'pending' // 默认状态为待审核
    });

    return await merchantRepository.save(merchant);
};

export const getMerchantService = async (merchantId: string) => {
    // 获取商家信息
    const merchant = await merchantRepository.findOne({
        where: { merchantId },
        select: ['merchantId', 'userId', 'shopName', 'shopDescription', 'shopStatus', 'shopCategory', 'createdAt', 'updatedAt']
    });

    if (!merchant) {
        throw new Error('商家不存在');
    }

    // 获取该商家的所有商品
    const products = await productRepository.find({
        where: { merchantId },
        select: [
            'productId',
            'name',
            'description',
            'price',
            'category',
            'imageUrl',
            'rank',
            'createdAt',
            'updatedAt'
        ],
        order: {
            rank: 'DESC',
            createdAt: 'DESC'
        }
    });

    // 返回合并后的数据
    return {
        ...merchant,
        products
    };
};

export const getMerchantByUserIdService = async (userId: string) => {
    // 获取用户的所有商家信息
    const merchants = await merchantRepository.find({
        where: { userId },
        select: ['merchantId', 'userId', 'shopName', 'shopDescription', 'shopStatus', 'shopCategory', 'createdAt', 'updatedAt']
    });

    if (!merchants || merchants.length === 0) {
        throw new Error('未找到商家信息');
    }

    // 为每个商家获取其商品列表
    const merchantsWithProducts = await Promise.all(
        merchants.map(async (merchant) => {
            const products = await productRepository.find({
                where: { merchantId: merchant.merchantId },
                select: [
                    'productId',
                    'name',
                    'description',
                    'price',
                    'category',
                    'imageUrl',
                    'rank',
                    'createdAt',
                    'updatedAt'
                ],
                order: {
                    rank: 'DESC',
                    createdAt: 'DESC'
                }
            });

            return {
                ...merchant,
                products
            };
        })
    );

    return merchantsWithProducts;
};

export const updateMerchantService = async (merchantId: string, updateData: Partial<Merchant>) => {
    const merchant = await merchantRepository.findOne({ where: { merchantId } });
    if (!merchant) {
        throw new Error('商家不存在');
    }
    Object.assign(merchant, updateData);
    return await merchantRepository.save(merchant);
};

export const deleteMerchantService = async (merchantId: string) => {
    const result = await merchantRepository.delete({ merchantId });
    if (result.affected === 0) {
        throw new Error('商家不存在');
    }
    return result;
};

export const getAllMerchantsService = async () => {
    // 获取所有商家
    const merchants = await merchantRepository.find({
        select: ['merchantId', 'userId', 'shopName', 'shopDescription', 'shopStatus', 'shopCategory', 'createdAt', 'updatedAt']
    });

    // 为每个商家获取其商品
    const merchantsWithProducts = await Promise.all(
        merchants.map(async (merchant) => {
            const products = await productRepository.find({
                where: { merchantId: merchant.merchantId },
                select: [
                    'productId',
                    'name',
                    'description',
                    'price',
                    'category',
                    'imageUrl',
                    'rank',
                    'createdAt',
                    'updatedAt'
                ],
                order: {
                    rank: 'DESC',
                    createdAt: 'DESC'
                }
            });

            return {
                ...merchant,
                products
            };
        })
    );

    return merchantsWithProducts;
};