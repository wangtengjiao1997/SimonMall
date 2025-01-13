'use client'
import { useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
    username: string;
    email: string;
    phone: string;
    address: string[];
}

export default function ProfilePage() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [editingPhone, setEditingPhone] = useState(false)
    const [editingAddress, setEditingAddress] = useState(false)
    const [newPhone, setNewPhone] = useState('')
    const [newAddress, setNewAddress] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (profile?.phone) {
            setNewPhone(profile.phone)
        }
    }, [profile?.phone])

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await getToken()
                const response = await fetch('http://localhost:3001/api/v1/users/getUserInfo', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json()

                if (data.success) {
                    setProfile(data.data)
                }
                console.log(profile)
            } catch (error) {
                console.error('获取用户资料失败:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchUserProfile()
        }
    }, [user, getToken])

    const handleUpdatePhone = async () => {
        try {
            const token = await getToken()
            const response = await fetch('http://localhost:3001/api/v1/users/updateUserInfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ phone: newPhone })
            })
            if (response.ok) {
                setProfile(prev => prev ? { ...prev, phone: newPhone } : null)
                setEditingPhone(false)
            }
        } catch (error) {
            console.error('更新手机号失败:', error)
        }
    }

    const handleUpdateAddress = async (index: number, newValue: string) => {
        try {
            const token = await getToken()
            const newAddresses = [...(profile?.address || [])]
            newAddresses[index] = newValue

            const response = await fetch('http://localhost:3001/api/v1/users/updateUserInfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ address: newAddresses })
            })

            if (response.ok) {
                setProfile(prev => prev ? { ...prev, address: newAddresses } : null)
            }
        } catch (error) {
            console.error('更新地址失败:', error)
        }
    }

    const handleAddAddress = async () => {
        try {
            const token = await getToken()
            const newAddresses = [...(profile?.address || []), '']

            const response = await fetch('http://localhost:3001/api/v1/users/updateUserInfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ address: newAddresses })
            })

            if (response.ok) {
                setProfile(prev => prev ? { ...prev, address: newAddresses } : null)
            }
        } catch (error) {
            console.error('添加地址失败:', error)
        }
    }

    const handleRemoveAddress = async (index: number) => {
        try {
            const token = await getToken()
            const newAddresses = profile?.address.filter((_, i) => i !== index) || []

            const response = await fetch('http://localhost:3001/api/v1/users/updateUserInfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ address: newAddresses })
            })

            if (response.ok) {
                setProfile(prev => prev ? { ...prev, address: newAddresses } : null)
            }
        } catch (error) {
            console.error('删除地址失败:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-semibold text-[#516b55] mb-8">个人资料</h1>

                <div className="space-y-6">
                    {/* 基本信息区域 */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 mb-1">用户名</h2>
                            <p className="text-lg text-gray-900">{profile?.username || '未设置'}</p>
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-gray-500 mb-1">邮箱</h2>
                            <p className="text-lg text-gray-900">{profile?.email || user?.primaryEmailAddress?.emailAddress}</p>
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-gray-500 mb-1">姓名</h2>
                            <p className="text-lg text-gray-900">{user?.fullName || '未设置'}</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h2 className="text-sm font-medium text-gray-500">手机号码</h2>
                                <button
                                    onClick={() => setEditingPhone(!editingPhone)}
                                    className="text-sm text-[#516b55] hover:text-[#3f523f]"
                                >
                                    {editingPhone ? '取消' : '编辑'}
                                </button>
                            </div>
                            {editingPhone ? (
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className="flex-1 p-2 border rounded focus:outline-none focus:border-[#516b55]"
                                        placeholder="输入新手机号"
                                    />
                                    <button
                                        onClick={handleUpdatePhone}
                                        className="px-4 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f]"
                                    >
                                        保存
                                    </button>
                                </div>
                            ) : (
                                <p className="text-lg text-gray-900">{profile?.phone || '未设置'}</p>
                            )}
                        </div>
                    </div>

                    {/* 地址列表区域 */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">收货地址</h2>
                            <button
                                onClick={handleAddAddress}
                                className="text-sm text-[#516b55] hover:text-[#3f523f] flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                添加地址
                            </button>
                        </div>

                        <div className="space-y-3">
                            {profile?.address && profile.address.length > 0 ? (
                                profile.address.map((addr, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={addr}
                                                    onChange={(e) => handleUpdateAddress(index, e.target.value)}
                                                    className="w-full p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-[#516b55] rounded"
                                                    placeholder={`收货地址 ${index + 1}`}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveAddress(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="删除地址"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">暂无收货地址</p>
                                    <button
                                        onClick={handleAddAddress}
                                        className="mt-2 text-[#516b55] hover:text-[#3f523f] text-sm"
                                    >
                                        添加收货地址
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}