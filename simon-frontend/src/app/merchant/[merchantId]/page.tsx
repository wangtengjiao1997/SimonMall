'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter, useParams } from 'next/navigation'
import anime from 'animejs'
import ProductModal from '@/components/merchant/ProductModal'
import MerchantModal from '@/components/merchant/MerchantModal'
import { Product } from '@/model/product'

interface MerchantInfo {
    merchantId: string;
    shopName: string;
    shopDescription: string;
    shopStatus: string;
    shopCategory: string;
    products: Product[];
}

type TabType = 'products' | 'orders' | 'new-order'

export default function MerchantDetail() {
    const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [hasChanges, setHasChanges] = useState(false)
    const [loading, setLoading] = useState(true)
    const { getToken } = useAuth()
    const router = useRouter()
    const params = useParams()
    const merchantId = params?.merchantId as string
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | undefined>()
    const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create')
    const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('products')

    useEffect(() => {
        if (merchantId) {
            fetchMerchantInfo()
        }
    }, [merchantId])

    useEffect(() => {
        if (merchantInfo) {
            const sortedProducts = [...merchantInfo.products].sort((a, b) => a.rank - b.rank)
            setProducts(sortedProducts)
        }
    }, [merchantInfo])

    useEffect(() => {
        const saveChanges = async () => {
            if (hasChanges) {
                try {
                    const token = await getToken()
                    const updatePromises = products.map((product, index) =>
                        fetch(`http://localhost:3001/api/v1/products/updateProduct/${product.productId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                rank: index + 1
                            })
                        })
                    )

                    await Promise.all(updatePromises)
                    setHasChanges(false)
                } catch (error) {
                    console.error('保存排序失败:', error)
                }
            }
        }

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                saveChanges()
                e.preventDefault()
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            saveChanges()
        }
    }, [hasChanges, products])

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

    const handleMoveProduct = (productId: string, direction: 'up' | 'down') => {
        const currentIndex = products.findIndex(p => p.productId === productId)
        if (currentIndex === -1) return

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

        if (targetIndex < 0 || targetIndex >= products.length) return

        const newProducts = [...products]
        const temp = newProducts[currentIndex]
        newProducts[currentIndex] = newProducts[targetIndex]
        newProducts[targetIndex] = temp

        const updatedProducts = newProducts.map((product, index) => ({
            ...product,
            rank: index + 1
        }))

        setProducts(updatedProducts)
        setHasChanges(true)
    }

    const handleTabChange = (tab: TabType) => {
        anime({
            targets: '.tab-content',
            opacity: [1, 0],
            translateY: [0, 20],
            duration: 200,
            easing: 'easeInOutQuad',
            complete: () => {
                setActiveTab(tab)
                anime({
                    targets: '.tab-content',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 300,
                    easing: 'easeOutQuad'
                })
            }
        })
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
            <div className="max-w-6xl mx-auto">
                {/* 店铺信息卡片 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#516b55]">{merchantInfo?.shopName}</h1>
                            <p className="text-gray-500 mt-2">{merchantInfo?.shopDescription}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsMerchantModalOpen(true)}
                                className="px-4 py-2 text-[#516b55] hover:bg-[#516b55] hover:text-white rounded border border-[#516b55] transition-colors"
                            >
                                编辑店铺
                            </button>
                        </div>
                    </div>
                </div>

                {/* 标签页导航 */}
                <div className="flex border-b mb-6">
                    <button
                        onClick={() => handleTabChange('products')}
                        className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'products'
                                ? 'text-[#516b55]'
                                : 'text-gray-500 hover:text-[#516b55]'
                            }`}
                    >
                        商品管理
                        {activeTab === 'products' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#516b55]" />
                        )}
                    </button>
                    <button
                        onClick={() => handleTabChange('orders')}
                        className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'orders'
                                ? 'text-[#516b55]'
                                : 'text-gray-500 hover:text-[#516b55]'
                            }`}
                    >
                        历史订单
                        {activeTab === 'orders' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#516b55]" />
                        )}
                    </button>
                    <button
                        onClick={() => handleTabChange('new-order')}
                        className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'new-order'
                                ? 'text-[#516b55]'
                                : 'text-gray-500 hover:text-[#516b55]'
                            }`}
                    >
                        创建订单
                        {activeTab === 'new-order' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#516b55]" />
                        )}
                    </button>
                </div>

                {/* 标签页内容 */}
                <div className="tab-content">
                    {activeTab === 'products' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {/* 商品列表 */}
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
                                {products.map((product, index) => (
                                    <div
                                        key={product.productId}
                                        className="flex items-center justify-between p-4 border rounded hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => handleMoveProduct(product.productId!, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => handleMoveProduct(product.productId!, 'down')}
                                                    disabled={index === products.length - 1}
                                                >
                                                    ↓
                                                </button>
                                            </div>
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
                                                onClick={() => product.productId && handleDeleteProduct(product.productId)}
                                                className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white rounded border border-red-600 transition-colors"
                                            >
                                                删除
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {products.length === 0 && (
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
                    )}

                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {/* 历史订单列表 */}
                            <div className="space-y-4">
                                {/* 这里添加订单列表组件 */}
                            </div>
                        </div>
                    )}

                    {activeTab === 'new-order' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {/* 创建订单表单 */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-r pr-6">
                                    <h3 className="text-lg font-medium mb-4">选择商品</h3>
                                    {/* 商品选择列表 */}
                                </div>
                                <div className="pl-6">
                                    <h3 className="text-lg font-medium mb-4">订单详情</h3>
                                    {/* 订单表单 */}
                                </div>
                            </div>
                        </div>
                    )}
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
                productsCount={products.length}
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

            {hasChanges && (
                <div className="fixed bottom-4 right-4 bg-[#516b55] text-white px-4 py-2 rounded shadow-lg">
                    排序已更改，离开页面时将自动保存
                </div>
            )}
        </div>
    )
}