interface Product {
    productId: string;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    rank: number;
    createdAt: string;
    updatedAt: string;
}

interface Merchant {
    merchantId: string;
    userId: string;
    shopName: string;
    shopDescription: string;
    shopStatus: string;
    shopCategory: string;
    products: Product[];
    createdAt: string;
    updatedAt: string;
}

interface MerchantCardProps {
    merchant: Merchant;
    onClick?: () => void;
}

export default function MerchantCard({ merchant, onClick }: MerchantCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="p-4">
                <div className="flex items-start gap-4">
                    {/* 商家信息 */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">{merchant.shopName}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${merchant.shopStatus === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {merchant.shopStatus === 'active' ? '营业中' : '审核中'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{merchant.shopDescription}</p>
                        <div className="text-xs text-gray-400 mt-2">
                            分类：{merchant.shopCategory}
                        </div>
                    </div>
                </div>

                {/* 商品预览 */}
                {merchant.products && merchant.products.length > 0 && (
                    <div className="mt-4">
                        <div className="grid grid-cols-3 gap-2">
                            {merchant.products
                                .sort((a, b) => a.rank - b.rank)
                                .slice(0, 3)
                                .map((product) => (
                                    <div key={product.productId} className="relative aspect-square rounded-md overflow-hidden">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                                            <div className="truncate">{product.name}</div>
                                            <div>¥{product.price}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}