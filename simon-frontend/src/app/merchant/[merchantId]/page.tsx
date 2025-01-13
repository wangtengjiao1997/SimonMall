'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter, useParams } from 'next/navigation'
import ProductModal from '@/components/merchant/ProductModal'
import MerchantModal from '@/components/merchant/MerchantModal'

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

interface MerchantInfo {
    merchantId: string;
    shopName: string;
    shopDescription: string;
    shopStatus: string;
    shopCategory: string;
    products: Product[];
}

export default function MerchantDetail() {
    const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const { getToken } = useAuth()
    const router = useRouter()
    const params = useParams()
    const merchantId = params?.merchantId as string
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | undefined>()
    const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create')
    const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false)

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

    const handleDeleteProduct = async (productId: string) => {
        try {
            const token = await getToken()
            const response = await fetch(`http://localhost:3001/api/v1/merchants/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                // 刷新商家信息
                fetchMerchantInfo()
            }
        } catch (error) {
            console.error('删除商品失败:', error)
        }
    }

    const handleAddProduct = () => {
        setProductModalMode('create')
        setEditingProduct(undefined)
        setIsProductModalOpen(true)
    }

    const handleEditProduct = (product: Product) => {
        setProductModalMode('edit')
        setEditingProduct(product)
        setIsProductModalOpen(true)
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
                    <button
                        onClick={() => router.push('/merchant/dashboard')}
                        className="mt-4 px-4 py-2 text-[#516b55] hover:bg-[#516b55] hover:text-white rounded border border-[#516b55] transition-colors"
                    >
                        返回店铺列表
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 店铺基本信息 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{merchantInfo.shopName}</h1>
                            <p className="text-gray-500 mt-2">{merchantInfo.shopDescription}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-gray-500">
                                    分类：{merchantInfo.shopCategory}
                                </span>
                                <span className={`px-2 py-1 rounded text-sm ${merchantInfo.shopStatus === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {merchantInfo.shopStatus === 'active' ? '营业中' : '审核中'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMerchantModalOpen(true)}
                            className="px-4 py-2 text-[#516b55] hover:bg-[#516b55] hover:text-white rounded border border-[#516b55] transition-colors"
                        >
                            编辑店铺
                        </button>
                    </div>
                </div>

                {/* 商品列表 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">商品列表</h2>
                        <button
                            onClick={handleAddProduct}
                            className="px-4 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f] transition-colors"
                        >
                            添加商品
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {merchantInfo.products.map((product) => (
                            <div
                                key={product.productId}
                                className="flex items-center justify-between p-4 border rounded hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="font-medium text-lg">{product.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                                        <p className="text-[#516b55] font-medium mt-1">¥{product.price}</p>
                                        <p className="text-gray-400 text-xs mt-1">分类：{product.category}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="px-3 py-1 text-[#516b55] hover:bg-[#516b55] hover:text-white rounded border border-[#516b55] transition-colors"
                                    >
                                        编辑
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.productId)}
                                        className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white rounded border border-red-600 transition-colors"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        ))}

                        {merchantInfo.products.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded">
                                <p className="text-gray-500">暂无商品</p>
                                <button
                                    onClick={handleAddProduct}
                                    className="mt-4 px-4 py-2 text-[#516b55] hover:bg-[#516b55] hover:text-white rounded border border-[#516b55] transition-colors"
                                >
                                    添加商品
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSuccess={() => {
                    fetchMerchantInfo()
                    setIsProductModalOpen(false)
                }}
                merchantId={merchantId}
                product={editingProduct}
                mode={productModalMode}
            />

            <MerchantModal
                isOpen={isMerchantModalOpen}
                onClose={() => setIsMerchantModalOpen(false)}
                onSuccess={() => {
                    fetchMerchantInfo()
                    setIsMerchantModalOpen(false)
                }}
                merchant={merchantInfo}
                mode="edit"
            />
        </div>
    )
}