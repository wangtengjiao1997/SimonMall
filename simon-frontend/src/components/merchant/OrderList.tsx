'use client'
import { DisplayOrderItem } from '@/model/order'
import { useState, useEffect } from 'react'
import anime from 'animejs'

interface OrderListProps {
    orderItems: DisplayOrderItem[];
}


export default function OrderList({ orderItems }: OrderListProps) {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
    const handleExpand = (orderId: string) => {
        if (expandedOrderId === orderId) {
            anime({
                targets: `#order-details-${orderId}`,
                height: 0,
                opacity: 0,
                duration: 300,
                easing: 'easeOutQuad',
                complete: () => setExpandedOrderId(null)
            })
        } else {
            setExpandedOrderId(orderId)
            anime({
                targets: `#order-details-${orderId}`,
                height: ['0px', 'auto'],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            })
        }
    }

    return (
        <div className="space-y-4">
            {orderItems.map((item) => (
                <div
                    key={item.orderItemId}
                    className="bg-white rounded-lg border shadow-sm overflow-hidden"
                >
                    <div
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleExpand(item.orderItemId)}
                    >
                        <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 text-sm rounded ${item.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : item.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {item.status === 'completed' ? '已完成' :
                                    item.status === 'pending' ? '待发货' : '已取消'}
                            </span>
                            <div>
                                <p className="font-medium">订单号：{item.order.orderId}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-[#516b55]">
                                    ¥{Number(item.price).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        id={`order-details-${item.orderItemId}`}
                        className="border-t overflow-hidden"
                        style={{ height: expandedOrderId === item.orderItemId ? 'auto' : 0, opacity: expandedOrderId === item.orderItemId ? 1 : 0 }}
                    >
                        <div className="p-4 space-y-4">
                            {/* 商品信息 */}
                            <div>
                                <h4 className="font-medium mb-2">商品信息</h4>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            ¥{Number(item.price).toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium text-[#516b55]">
                                        ¥{(Number(item.price) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* 活动信息 */}
                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">活动信息</h4>
                                <p className="text-gray-600">活动名称：{item.shoppingEvent.eventName}</p>
                                <p className="text-gray-600">活动时间：{new Date(item.shoppingEvent.startTime).toLocaleString()} - {new Date(item.shoppingEvent.endTime).toLocaleString()}</p>
                            </div>

                            {/* 用户信息 */}
                            {item.order && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">用户信息</h4>
                                    <p className="text-gray-600">用户名：{item.order.recipientName}</p>
                                    <p className="text-gray-600">电话：{item.order.recipientPhone}</p>
                                    <p className="text-gray-600">地址：{item.order.shippingAddress}</p>
                                </div>
                            )}

                            {/* 问答信息 */}
                            {item.order.answers && item.order.answers.length > 0 && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">问卷信息</h4>
                                    <div className="space-y-2">
                                        {item.order.answers.map((answer, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded">
                                                <p className="text-gray-700 font-medium mb-1">
                                                    {answer.question}
                                                </p>
                                                <p className="text-gray-600">
                                                    {answer.type === 'text' ? (
                                                        answer.answer as string
                                                    ) : Array.isArray(answer.answer) ? (
                                                        answer.answer.join('、')
                                                    ) : (
                                                        answer.answer
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {orderItems.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">暂无订单</p>
                </div>
            )}
        </div>
    )
}