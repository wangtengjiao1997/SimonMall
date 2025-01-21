'use client'
import { EventWithProducts } from '@/model/event'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { MerchantInfo } from '@/model/merchant'
interface EventCardProps {
    event: EventWithProducts
}


export default function EventCard({ event }: EventCardProps) {
    const router = useRouter()
    const { getToken } = useAuth()
    const [merchant, setMerchant] = useState<MerchantInfo | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMerchantInfo = async () => {
            try {
                const token = await getToken()
                const response = await fetch(`http://localhost:3001/api/v1/merchants/getMerchant/${event.merchantId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json()

                if (data.success) {
                    setMerchant(data.data)
                }
            } catch (error) {
                console.error('获取商家信息失败:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMerchantInfo()
    }, [event.merchantId, getToken])

    if (loading || !merchant) {
        return (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    return (
        <div
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/shop/${event.eventId}`)}
        >
            <div className="p-6">
                {/* 商家信息 */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-[#516b55]">{merchant.shopName}</h3>
                        <p className="text-sm text-gray-500">{merchant.shopDescription}</p>
                    </div>
                </div>

                {/* 活动信息 */}
                <div className="mb-4">
                    <h4 className="text-xl font-medium text-gray-900">{event.eventName}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{event.eventDescription}</p>
                </div>

                {/* 活动商品 */}
                <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {event.eventProducts.slice(0, 3).map((product) => (
                            <div key={product.productId} className="group relative">
                                <div className="aspect-square overflow-hidden rounded-lg">

                                    <img
                                        src={product.product.imageUrl}
                                        alt={product.product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                </div>
                                <div className="mt-2">
                                    <h5 className="text-sm font-medium text-gray-900 truncate">
                                        {product.product.name}
                                    </h5>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[#516b55] font-medium">¥{product.price}</span>
                                        <span className="text-xs text-gray-500">
                                            限购{product.limitPerUser}件
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {event.eventProducts.length > 3 && (
                            <div className="flex items-center justify-center aspect-square bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-500">
                                    +{event.eventProducts.length - 3} 件商品
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}