import { Order } from '@/model/order'
import { useState } from 'react'
import anime from 'animejs'

interface OrderListProps {
    orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
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
            {orders.map((order) => (
                <div
                    key={order.orderId}
                    className="bg-white rounded-lg border shadow-sm overflow-hidden"
                >
                    <div
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleExpand(order.orderId)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">订单号：{order.orderId}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded text-sm ${order.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : order.status === 'cancelled'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.status === 'completed' ? '已完成' :
                                        order.status === 'cancelled' ? '已取消' : '待处理'}
                                </span>
                                <span className="font-medium text-[#516b55]">
                                    ¥{order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        id={`order-details-${order.orderId}`}
                        className="border-t overflow-hidden"
                        style={{ height: expandedOrderId === order.orderId ? 'auto' : 0, opacity: expandedOrderId === order.orderId ? 1 : 0 }}
                    >
                        <div className="p-4 space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">订单商品</h4>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.productId} className="flex items-center gap-4">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    ¥{item.price.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-medium text-[#516b55]">
                                                ¥{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">收货信息</h4>
                                <p className="text-gray-600">收货人：{order.customerName}</p>
                                <p className="text-gray-600">电话：{order.customerPhone}</p>
                                <p className="text-gray-600">地址：{order.customerAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}