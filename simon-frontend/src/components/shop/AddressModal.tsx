'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (addressInfo: AddressInfo) => void;
    defaultAddress?: AddressInfo;
}

export interface AddressInfo {
    name: string;
    phone: string;
    address: string;
}

interface UserInfo {
    userId: string;
    username: string;
    phone: string;
    address: string;
}

export default function AddressModal({ isOpen, onClose, onSubmit, defaultAddress }: AddressModalProps) {
    const [addressInfo, setAddressInfo] = useState<AddressInfo>({
        name: '',
        phone: '',
        address: ''
    })
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [useExistingAddress, setUseExistingAddress] = useState(false)
    const { getToken } = useAuth()

    useEffect(() => {
        if (isOpen) {
            fetchUserInfo()
        }
    }, [isOpen])

    useEffect(() => {
        if (defaultAddress) {
            setAddressInfo(defaultAddress)
        }
    }, [defaultAddress])

    const fetchUserInfo = async () => {
        try {
            const token = await getToken()
            const response = await fetch('http://localhost:3001/api/v1/users/getUserInfo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.success) {
                setUserInfo(data.data)
                // 如果用户有地址信息，默认使用已有地址
                if (data.data.address && data.data.phone) {
                    setAddressInfo({
                        name: data.data.username,
                        phone: data.data.phone,
                        address: data.data.address
                    })
                    setUseExistingAddress(true)
                }
            }
        } catch (error) {
            console.error('获取用户信息失败:', error)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(addressInfo)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">确认收货信息</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            收货人姓名
                        </label>
                        <input
                            type="text"
                            value={addressInfo.name}
                            onChange={(e) => setAddressInfo(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#516b55]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            联系电话
                        </label>
                        <input
                            type="tel"
                            value={addressInfo.phone}
                            onChange={(e) => setAddressInfo(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#516b55]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            收货地址
                        </label>
                        <textarea
                            value={addressInfo.address}
                            onChange={(e) => setAddressInfo(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#516b55]"
                            rows={3}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#516b55] text-white rounded-md hover:bg-[#3f523f] transition-colors"
                        >
                            确认提交
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}