'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'

interface Product {
    productId: string;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    rank: number;
}

interface MerchantInfo {
    merchantId: string;
    shopName: string;
    shopDescription: string;
    shopStatus: string;
    shopCategory: string;
    products: Product[];
}

export default function ShopDetail() {
    const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const { getToken } = useAuth()
    const params = useParams()
    const merchantId = params?.merchantId as string

    useEffect(() => {
        if (merchantId) {
            fetchMerchantInfo()
        }
    }, [merchantId])

    const fetchMerchantInfo = async () => {
        try {
            const token = await getToken()
            const response = await fetch(`http://localhost:3001/api/v1/merchants/getMerchant/${merchantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.success) {
                setMerchantInfo(data.data)
            }
        } catch (error) {
            console.error('获取商家信息失败:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#516b55] mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                </div>
            </div>
        )
    }

    if (!merchantInfo) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-500">未找到店铺信息</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 店铺基本信息 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold text-gray-900">{merchantInfo.shopName}</h1>
                            <span className={`px-2 py-1 rounded text-sm ${merchantInfo.shopStatus === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {merchantInfo.shopStatus === 'active' ? '营业中' : '休息中'}
                            </span>
                        </div>
                        <p className="text-gray-500 mt-2">{merchantInfo.shopDescription}</p>
                        <div className="mt-2">
                            <span className="text-sm text-gray-500">
                                分类：{merchantInfo.shopCategory}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 商品列表 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">商品列表</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {merchantInfo.products.map((product) => (
                            <div
                                key={product.productId}
                                className="flex gap-4 p-4 border rounded hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-medium text-lg">{product.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                                    <p className="text-[#516b55] font-medium mt-2">¥{product.price}</p>
                                    <p className="text-gray-400 text-xs mt-1">分类：{product.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {merchantInfo.products.length === 0 && (
                        <div className="text-center py-8 bg-gray-50 rounded">
                            <p className="text-gray-500">暂无商品</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}