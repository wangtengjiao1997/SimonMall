'use client'
import { useUser, useClerk } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UserMenu() {
    const { user } = useUser()
    const { signOut } = useClerk()
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    if (!user) return null

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && !(event.target as Element)?.closest('.user-menu')) {
                setIsOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isOpen])

    return (
        <div className="relative user-menu">
            {/* 用户头像按钮 */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1"
            >
                <img
                    src={user.imageUrl}
                    alt="用户头像"
                    className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.fullName}</span>
            </button>

            {/* 下拉菜单 - 调整定位和最大高度 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 max-h-[calc(100vh-80px)] overflow-y-auto"
                    style={{
                        top: '100%',
                        transform: 'translateY(0)',
                        maxHeight: 'calc(100vh - var(--header-height, 80px))'
                    }}
                >
                    <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium truncate">{user.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>

                    {/* 菜单项添加 truncate 防止文本溢出 */}
                    <button
                        onClick={() => router.push('/profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
                    >
                        个人资料
                    </button>

                    {/* 订单历史按钮 */}
                    <button
                        onClick={() => router.push('/profile/orders')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
                    >
                        我的订单
                        <span className="ml-2 text-xs text-gray-500">查看订单历史</span>
                    </button>

                    <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 truncate border-t"
                    >
                        退出登录
                    </button>
                </div>
            )}
        </div>
    )
}