'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

interface MerchantInfo {
    merchantId?: string;
    shopName: string;
    shopDescription: string;
    shopCategory: string;
    shopStatus: string;
}

interface MerchantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    merchant?: MerchantInfo; // 如果是编辑模式，传入现有店铺数据
    mode: 'create' | 'edit';
}

export default function MerchantModal({
    isOpen,
    onClose,
    onSuccess,
    merchant,
    mode
}: MerchantModalProps) {
    const [formData, setFormData] = useState<Omit<MerchantInfo, 'merchantId'>>({
        shopName: '',
        shopDescription: '',
        shopCategory: 'food',
        shopStatus: 'active'  // 默认状态
    })
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()

    useEffect(() => {
        if (merchant && mode === 'edit') {
            setFormData({
                shopName: merchant.shopName,
                shopDescription: merchant.shopDescription,
                shopCategory: merchant.shopCategory
            })
        }
    }, [merchant, mode])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = await getToken()
            const url = mode === 'create'
                ? 'http://localhost:3001/api/v1/merchants/createMerchant'
                : `http://localhost:3001/api/v1/merchants/updateMerchant/${merchant?.merchantId}`

            // 根据模式准备不同的请求数据
            const requestData = mode === 'create'
                ? {
                    ...formData,
                    userId: 'user_2rQaTRxYkNbITQ7mhjSfB4zXKky' // 这里应该从 Clerk 获取用户 ID
                }
                : {
                    shopName: formData.shopName,
                    shopDescription: formData.shopDescription
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
                        shopName: '',
                        shopDescription: '',
                        shopCategory: 'food',
                        shopStatus: 'active'
                    })
                }
            }
        } catch (error) {
            console.error(`${mode === 'create' ? '创建' : '更新'}店铺失败:`, error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === 'create' ? '新增店铺' : '编辑店铺'}
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
                            店铺名称
                        </label>
                        <input
                            type="text"
                            value={formData.shopName}
                            onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            店铺描述
                        </label>
                        <textarea
                            value={formData.shopDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, shopDescription: e.target.value }))}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            店铺分类
                        </label>
                        <select
                            value={formData.shopCategory}
                            onChange={(e) => setFormData(prev => ({ ...prev, shopCategory: e.target.value }))}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                        >
                            <option value="food">食品</option>
                            <option value="clothing">服装</option>
                            <option value="electronics">电子产品</option>
                            <option value="other">其他</option>
                        </select>
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
                            className={`px-4 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (mode === 'create' ? '创建中...' : '更新中...') : (mode === 'create' ? '创建店铺' : '更新店铺')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}