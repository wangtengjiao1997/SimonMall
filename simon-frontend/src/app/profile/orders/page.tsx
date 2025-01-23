'use client'
import { useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { DisplayOrderItem } from '@/model/order'
import Link from 'next/link'

export default function OrderHistoryPage() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [ordersItems, setOrdersItems] = useState<DisplayOrderItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const token = await getToken()
            const response = await fetch('http://localhost:3001/api/v1/orderItems/user/items', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            console.log(data)
            if (data.success) {
                setOrdersItems(data.data)
            }
        } catch (error) {
            console.error('获取订单历史失败:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg p-6">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-[#516b55]">我的订单</h1>
                    <Link
                        href="/profile"
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        返回个人资料
                    </Link>
                </div>

                <div className="space-y-4">
                    {ordersItems.map((orderItem) => (
                        <div
                            key={orderItem.orderItemId}
                            className="bg-white rounded-lg shadow-md p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-medium">订单号：{orderItem.orderItemId}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        下单时间：{new Date(orderItem.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-sm rounded ${orderItem.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : orderItem.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {orderItem.status === 'completed' ? '已完成' :
                                        orderItem.status === 'pending' ? '待发货' : '已取消'}
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <img
                                    src={orderItem.product.imageUrl}
                                    alt={orderItem.product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{orderItem.product.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        数量：{orderItem.quantity}
                                    </p>
                                    <p className="text-[#516b55] font-medium mt-2">
                                        ¥{Number(orderItem.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-600">
                                    活动名称：{orderItem.shoppingEvent.eventName}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    收货人名字：{orderItem.order.recipientName}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    收货人电话：{orderItem.order.recipientPhone}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    收货地址：{orderItem.order.shippingAddress}
                                </p>
                            </div>
                        </div>
                    ))}

                    {ordersItems.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">暂无订单记录</p>
                            <Link
                                href="/shop"
                                className="text-[#516b55] hover:text-[#3f523f] mt-2 inline-block"
                            >
                                去逛逛
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}