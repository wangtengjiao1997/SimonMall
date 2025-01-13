'use client'
import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import CreateMerchantModal from '@/components/merchant/CreateMerchantModal'
import MerchantModal from '@/components/merchant/MerchantModal'

interface Merchant {
    merchantId: string;
    userId: string;
    shopName: string;
    shopDescription: string;
    shopStatus: string;
    shopCategory: string;
}

export default function MerchantDashboard() {
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [loading, setLoading] = useState(true)
    const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false)
    const { getToken } = useAuth()
    const { user } = useUser()
    const router = useRouter()

    useEffect(() => {
        fetchMerchants()
    }, [user])

    const fetchMerchants = async () => {
        try {
            const token = await getToken()
            const response = await fetch(`http://localhost:3001/api/v1/merchants/getCurrentUserMerchant`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response)
            const data = await response.json()
            if (data.success) {
                setMerchants(data.data)
            }
        } catch (error) {
            console.error('获取商家列表失败:', error)
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

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-[#516b55]">我的店铺</h1>
                    <button
                        onClick={() => setIsMerchantModalOpen(true)}
                        className="px-4 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f] transition-colors"
                    >
                        新增店铺
                    </button>
                </div>

                <div className="grid gap-4">
                    {merchants.map((merchant) => (
                        <div
                            key={merchant.merchantId}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => router.push(`/merchant/${merchant.merchantId}`)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900">{merchant.shopName}</h2>
                                    <p className="text-gray-500 mt-1">{merchant.shopDescription}</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        分类：{merchant.shopCategory}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-sm ${merchant.shopStatus === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {merchant.shopStatus === 'active' ? '营业中' : '审核中'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {merchants.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-4">您还没有店铺</p>
                        <button
                            onClick={() => router.push('/merchant/new')}
                            className="px-6 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f] transition-colors"
                        >
                            创建店铺
                        </button>
                    </div>
                )}

                <MerchantModal
                    isOpen={isMerchantModalOpen}
                    onClose={() => setIsMerchantModalOpen(false)}
                    onSuccess={() => {
                        fetchMerchants()
                        setIsMerchantModalOpen(false)
                    }}
                    mode="create"
                />
            </div>
        </div>
    )
}