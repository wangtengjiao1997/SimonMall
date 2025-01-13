'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import MerchantCard from '@/components/merchant/MerchantCard'
import SearchBar from '@/components/SearchBar'
import { useRouter } from 'next/navigation'

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

export default function ShopPage() {
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const { getToken } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const token = await getToken()
                const response = await fetch('http://localhost:3001/api/v1/merchants/allMerchants', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
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

        fetchMerchants()
    }, [getToken])

    // 过滤商家列表
    const filteredMerchants = merchants.filter(merchant =>
        merchant.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.shopDescription.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold text-[#516b55] mb-6">商家列表</h1>

                {/* 搜索栏 */}
                <div className="mb-6">
                    <SearchBar
                        placeholder="搜索商家..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>

                {/* 商家列表 */}
                <div className="grid gap-6">
                    {filteredMerchants.map((merchant) => (
                        <MerchantCard
                            key={merchant.merchantId}
                            merchant={merchant}
                            onClick={() => router.push(`/shop/${merchant.merchantId}`)}
                        />
                    ))}
                </div>

                {filteredMerchants.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? '没有找到相关商家' : '暂无商家信息'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}