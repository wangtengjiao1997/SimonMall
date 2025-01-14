'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import ImageUpload from '@/components/common/ImageUpload'
import { useFileUpload } from '@/hook/useFileUpload'
import { Product } from '@/model/product'


interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    merchantId: string;
    product?: Product; // 如果是编辑模式，传入现有商品数据
    mode: 'create' | 'edit';
    productsCount?: number; // 添加商品数量属性
}

export default function ProductModal({
    isOpen,
    onClose,
    onSuccess,
    merchantId,
    product,
    mode,
    productsCount = 0 // 设置默认值
}: ProductModalProps) {
    const [formData, setFormData] = useState<Omit<Product, 'productId'>>({
        name: '',
        description: '',
        price: 0,
        category: 'food',
        imageUrl: '',
        rank: productsCount + 1 // 设置初始 rank 值
    })
    const { imageUrl, uploading, handleUpload, error } = useFileUpload()
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()

    useEffect(() => {
        if (product && mode === 'edit') {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                imageUrl: product.imageUrl,
                rank: product.rank
            })
        }
    }, [product, mode])

    useEffect(() => {
        if (imageUrl) {
            setFormData(prev => ({ ...prev, imageUrl }))
        }
    }, [imageUrl])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = await getToken()
            const url = mode === 'create'
                ? 'http://localhost:3001/api/v1/products/createProduct'
                : `http://localhost:3001/api/v1/products/updateProduct/${product?.productId}`

            const requestData = mode === 'create'
                ? {
                    ...formData,
                    merchantId,
                    price: Number(formData.price),
                    rank: productsCount + 1 // 确保使用最新的 rank 值
                }
                : {
                    ...formData,
                    price: Number(formData.price)
                }

            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            })

            if (response.ok) {
                onSuccess()
                onClose()
                if (mode === 'create') {
                    setFormData({
                        name: '',
                        description: '',
                        price: 0,
                        category: 'food',
                        imageUrl: '',
                        rank: productsCount + 1
                    })
                }
            }
        } catch (error) {
            console.error(`${mode === 'create' ? '创建' : '更新'}商品失败:`, error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === 'create' ? '添加商品' : '编辑商品'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            商品名称
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            商品描述
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            价格
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            商品分类
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                        >
                            <option value="food">食品</option>
                            <option value="clothing">服装</option>
                            <option value="electronics">电子产品</option>
                            <option value="other">其他</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            商品图片
                        </label>
                        <ImageUpload
                            imageUrl={formData.imageUrl}
                            onUpload={handleUpload}
                            uploading={uploading}
                            error={error}
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (mode === 'create' ? '添加中...' : '更新中...') : (mode === 'create' ? '添加商品' : '更新商品')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}