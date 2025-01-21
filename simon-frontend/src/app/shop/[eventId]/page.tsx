'use client'
import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { EventWithProducts } from '@/model/event'
import { MerchantInfo } from '@/model/merchant'
import { SubmitOrder } from '@/model/order'
import AddressModal, { AddressInfo } from '@/components/shop/AddressModal'

interface CartItem {
    productId: string;
    quantity: number;
}

export default function EventDetailPage() {
    const [event, setEvent] = useState<EventWithProducts | null>(null)
    const [merchant, setMerchant] = useState<MerchantInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState<CartItem[]>([])
    const { getToken } = useAuth()
    const { user } = useUser()
    const params = useParams()
    const eventId = params?.eventId as string
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null)

    useEffect(() => {
        fetchEventDetail()
    }, [eventId])

    useEffect(() => {
        if (event?.merchantId) {
            fetchMerchantInfo()
        }
    }, [event?.merchantId])

    const fetchEventDetail = async () => {
        try {
            const token = await getToken()
            const response = await fetch(`http://localhost:3001/api/v1/events/getEvent/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.success) {
                setEvent(data.data)
            }
        } catch (error) {
            console.error('获取活动详情失败:', error)
        }
    }

    const fetchMerchantInfo = async () => {
        if (!event?.merchantId) return

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

    const handleQuantityChange = (productId: string, quantity: number, limitPerUser: number) => {
        if (quantity < 0 || quantity > limitPerUser) return

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === productId)
            if (quantity === 0) {
                return prevCart.filter(item => item.productId !== productId)
            }
            if (existingItem) {
                return prevCart.map(item =>
                    item.productId === productId ? { ...item, quantity } : item
                )
            }
            return [...prevCart, { productId, quantity }]
        })
    }

    const handleOpenAddressModal = () => {
        if (!user || cart.length === 0 || !event) {
            alert('请先选择商品')
            return
        }
        setIsAddressModalOpen(true)
    }

    const handleAddressSubmit = async (info: AddressInfo) => {
        setAddressInfo(info)
        setIsAddressModalOpen(false)
        await submitOrder(info)
    }

    const submitOrder = async (info: AddressInfo) => {
        if (!user || cart.length === 0 || !event) return

        try {
            const token = await getToken()

            const orderItems = cart.map(item => {
                const eventProduct = event.eventProducts.find(p => p.productId === item.productId)
                if (!eventProduct) throw new Error('商品不存在')

                return {
                    productId: item.productId,
                    eventId: event.eventId,
                    price: Number(eventProduct.price),
                    quantity: item.quantity
                }
            })

            const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

            const submitOrder: SubmitOrder = {
                eventId: event.eventId,
                userId: user.id,
                totalAmount,
                items: orderItems,
                recipientName: info.name,
                recipientPhone: info.phone,
                shippingAddress: info.address
            }

            const response = await fetch('http://localhost:3001/api/v1/orders/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submitOrder)
            })

            const data = await response.json()
            if (data.success) {
                setCart([])
                alert('下单成功！')
            } else {
                throw new Error(data.message || '下单失败')
            }
        } catch (error) {
            console.error('下单失败:', error)
            alert(error instanceof Error ? error.message : '下单失败，请重试')
        }
    }

    if (loading || !event || !merchant) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-96 bg-gray-200 rounded"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const totalAmount = cart.reduce((sum, item) => {
        const product = event.eventProducts.find(p => p.productId === item.productId)
        return sum + (product ? Number(product.price) * item.quantity : 0)
    }, 0)

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 商家信息 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-semibold text-[#516b55]">{merchant.shopName}</h1>
                    <p className="text-gray-500 mt-2">{merchant.shopDescription}</p>
                </div>

                {/* 活动信息 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-medium text-gray-900">{event.eventName}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600 mt-4">{event.eventDescription}</p>
                </div>

                {/* 商品列表 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">活动商品</h3>
                    <div className="space-y-6">
                        {event.eventProducts.map((product) => {
                            const cartItem = cart.find(item => item.productId === product.productId)
                            return (
                                <div key={product.productId} className="flex gap-6 p-4 border rounded-lg">
                                    <div className="w-24 h-24">
                                        <img
                                            src={product.product.imageUrl}
                                            alt={product.product.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{product.product.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{product.product.description}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <div>
                                                <span className="text-lg font-medium text-[#516b55]">¥{product.price}</span>
                                                <span className="text-sm text-gray-500 ml-2">限购{product.limitPerUser}件</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQuantityChange(product.productId, (cartItem?.quantity || 0) - 1, product.limitPerUser)}
                                                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50"
                                                    disabled={!cartItem}
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center">{cartItem?.quantity || 0}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(product.productId, (cartItem?.quantity || 0) + 1, product.limitPerUser)}
                                                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50"
                                                    disabled={cartItem?.quantity === product.limitPerUser}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 下单按钮 */}
                {cart.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <div>
                                <span className="text-gray-500">总计：</span>
                                <span className="text-xl font-medium text-[#516b55] ml-2">¥{totalAmount.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleOpenAddressModal}
                                className="px-8 py-3 bg-[#516b55] text-white rounded-lg hover:bg-[#3f523f] transition-colors"
                            >
                                提交订单
                            </button>
                        </div>
                    </div>
                )}

                {/* 地址确认弹窗 */}
                <AddressModal
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    onSubmit={handleAddressSubmit}
                    defaultAddress={addressInfo || undefined}
                />
            </div>
        </div>
    )
}