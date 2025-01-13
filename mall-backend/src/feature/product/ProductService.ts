import { DeepPartial } from 'typeorm';
import { Product } from '../../entities';
import { AppDataSource } from '../../config/DataSource';

const productRepository = AppDataSource.getRepository(Product);

export const createProductService = async (productData: DeepPartial<Product>) => {
    // 创建新商品
    const product = productRepository.create({
        ...productData,
        rank: 0 // 默认排序为0
    });
    return await productRepository.save(product);
};

export const getProductService = async (productId: string) => {
    const product = await productRepository.findOne({
        where: { productId },
        select: [
            'productId',
            'merchantId',
            'name',
            'description',
            'price',
            'category',
            'imageUrl',
            'rank',
            'createdAt',
            'updatedAt'
        ]
    });

    if (!product) {
        throw new Error('商品不存在');
    }
    return product;
};

export const updateProductService = async (productId: string, updateData: Partial<Product>) => {
    const product = await productRepository.findOne({ where: { productId } });
    if (!product) {
        throw new Error('商品不存在');
    }

    Object.assign(product, updateData);
    return await productRepository.save(product);
};

export const deleteProductService = async (productId: string) => {
    const result = await productRepository.delete({ productId });
    if (result.affected === 0) {
        throw new Error('商品不存在');
    }
    return result;
};

export const getAllProductsService = async () => {
    return await productRepository.find({
        select: [
            'productId',
            'merchantId',
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
};

export const getProductsByMerchantService = async (merchantId: string) => {
    return await productRepository.find({
        where: { merchantId },
        select: [
            'productId',
            'merchantId',
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
};