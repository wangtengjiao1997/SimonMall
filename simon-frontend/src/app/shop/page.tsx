'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import SearchBar from '@/components/SearchBar'
import { useRouter } from 'next/navigation'
import EventCard from '@/components/merchant/EventCard'
import { EventWithProducts } from '@/model/event'

export default function ShopPage() {
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const { getToken } = useAuth()
    const [events, setEvents] = useState<EventWithProducts[]>([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = await getToken()
                const response = await fetch('http://localhost:3001/api/v1/events/getAllEvents', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if (data.success) {
                    setEvents(data.data)
                }
            } catch (error) {
                console.error('获取商家列表失败:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [getToken])

    // 过滤商家列表
    const filteredEvents = events.filter(event =>
        event.status === 'active' &&
        (event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.eventDescription.toLowerCase().includes(searchTerm.toLowerCase()))
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

                {/* 团购活动部分 */}
                {filteredEvents.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold text-[#516b55] mb-6">正在进行的团购</h2>
                        <div className="grid gap-6">
                            {filteredEvents.map((event) => (
                                <EventCard key={event.eventId} event={event} />
                            ))}
                        </div>
                    </div>
                )}

                {filteredEvents.length === 0 && (
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