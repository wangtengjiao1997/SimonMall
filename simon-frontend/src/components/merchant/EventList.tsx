import { Event, EventWithProducts } from '@/model/event'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import anime from 'animejs'

interface EventListProps {
    events: Event[];
    onStatusChange?: (eventId: string, status: Event['status']) => Promise<void>;
}

export default function EventList({ events, onStatusChange }: EventListProps) {
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null)
    const [eventsWithProducts, setEventsWithProducts] = useState<EventWithProducts[]>([])
    const { getToken } = useAuth()

    useEffect(() => {
        fetchEventProducts()
    }, [events])

    const fetchEventProducts = async () => {
        try {
            const token = await getToken()
            const productsPromises = events.map(async (event) => {
                const response = await fetch(`http://localhost:3001/api/v1/eventProducts/event/${event.eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json()
                return {
                    ...event,
                    eventProducts: data.data
                }
            })
            const eventsData = await Promise.all(productsPromises)
            setEventsWithProducts(eventsData as EventWithProducts[])
        } catch (error) {
            console.error('获取活动商品失败:', error)
        }
    }

    const handleExpand = (eventId: string) => {
        if (expandedEventId === eventId) {
            anime({
                targets: `#event-details-${eventId}`,
                height: 0,
                opacity: 0,
                duration: 300,
                easing: 'easeOutQuad',
                complete: () => setExpandedEventId(null)
            })
        } else {
            setExpandedEventId(eventId)
            anime({
                targets: `#event-details-${eventId}`,
                height: ['0px', 'auto'],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            })
        }
    }

    const getStatusColor = (status: Event['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'completed':
                return 'bg-blue-100 text-blue-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    const getStatusText = (status: Event['status']) => {
        switch (status) {
            case 'active':
                return '进行中'
            case 'completed':
                return '已结束'
            case 'cancelled':
                return '已取消'
            default:
                return '未开始'
        }
    }

    return (
        <div className="space-y-4">
            {eventsWithProducts.map((event) => (
                <div
                    key={event.eventId}
                    className="bg-white rounded-lg border shadow-sm overflow-hidden"
                >
                    <div
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleExpand(event.eventId)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-lg">{event.eventName}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(event.status)}`}>
                                    {getStatusText(event.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        id={`event-details-${event.eventId}`}
                        className="border-t overflow-hidden"
                        style={{ height: expandedEventId === event.eventId ? 'auto' : 0, opacity: expandedEventId === event.eventId ? 1 : 0 }}
                    >
                        <div className="p-4 space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">活动详情</h4>
                                <p className="text-gray-600">{event.eventDescription}</p>
                            </div>

                            {/* 活动商品列表 */}
                            <div>
                                <h4 className="font-medium mb-2">活动商品</h4>
                                <div className="grid gap-4">
                                    {event.eventProducts?.map((product) => (
                                        <div key={product.productId} className="flex gap-4 p-4 border rounded">
                                            <img
                                                src={product.product.imageUrl}
                                                alt={product.product.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h5 className="font-medium">{product.product.name}</h5>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[#516b55] font-medium">
                                                        ¥{product.price}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    限购: {product.limitPerUser} 件/人
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">剩余库存</p>
                                                <p className="font-medium">{product.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {onStatusChange && event.status === 'pending' && (
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <button
                                        onClick={() => onStatusChange(event.eventId, 'active')}
                                        className="px-4 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f] transition-colors"
                                    >
                                        开始活动
                                    </button>
                                    <button
                                        onClick={() => onStatusChange(event.eventId, 'cancelled')}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    >
                                        取消活动
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {events.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">暂无团购活动</p>
                </div>
            )}
        </div>
    )
}