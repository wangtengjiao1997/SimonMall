'use client'
import { useState } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface FormData {
    username: string;
    email: string;
    phoneCountry: string;
    phone: string;
    address: string[];
}

interface FormErrors {
    username?: string;
    email?: string;
    phone?: string;
}

// 常用国家代码
const COUNTRY_CODES = [
    { code: '+86', country: '中国' },
    { code: '+1', country: '美国/加拿大' },
    { code: '+44', country: '英国' },
    { code: '+81', country: '日本' },
    { code: '+82', country: '韩国' },
    // 可以添加更多国家
]

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        phoneCountry: '+86',
        phone: '',
        address: ['']
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const { user } = useUser()
    const { getToken } = useAuth()
    const router = useRouter()

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // 邮箱验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = '请输入有效的邮箱地址'
        }

        // 电话号码验证
        if (formData.phone) {
            let isValid = false
            const phoneNumber = formData.phone.replace(/\s+/g, '')

            switch (formData.phoneCountry) {
                case '+86': // 中国
                    isValid = /^1[3-9]\d{9}$/.test(phoneNumber)
                    break
                case '+1': // 美国/加拿大
                    isValid = /^\d{10}$/.test(phoneNumber)
                    break
                default: // 其他国家
                    isValid = /^\d{6,15}$/.test(phoneNumber)
            }

            if (!isValid) {
                newErrors.phone = '请输入有效的电话号码'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddressChange = (index: number, value: string) => {
        const newAddresses = [...formData.address]
        newAddresses[index] = value
        setFormData(prev => ({
            ...prev,
            address: newAddresses
        }))
    }

    const handleAddNewAddress = () => {
        setFormData(prev => ({
            ...prev,
            address: [...prev.address, '']
        }))
    }

    const handleRemoveAddress = (index: number) => {
        if (formData.address.length > 1) {
            setFormData(prev => ({
                ...prev,
                address: prev.address.filter((_, i) => i !== index)
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            return
        }
        try {
            const token = await getToken()
            const response = await fetch('http://localhost:3001/api/v1/users/createUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    phone: formData.phone ? `${formData.phoneCountry}${formData.phone}` : ''
                })
            })

            if (response.ok) {
                router.push('/')
            } else {
                const data = await response.json()
                throw new Error(data.message || '提交失败')
            }
        } catch (error) {
            console.error('提交用户信息失败:', error)
        }
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-md">
                <h1 className="text-2xl font-semibold text-[#516b55] mb-6">完善个人信息</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[#516b55] mb-2">
                            邮箱 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-[#516b55]'}`}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[#516b55] mb-2">
                            手机号码
                        </label>
                        <div className="flex gap-2">
                            <select
                                name="phoneCountry"
                                value={formData.phoneCountry}
                                onChange={handleChange}
                                className="w-32 p-2 border border-[#516b55] rounded"
                            >
                                {COUNTRY_CODES.map(({ code, country }) => (
                                    <option key={code} value={code}>
                                        {country} {code}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`flex-1 p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-[#516b55]'}`}
                                placeholder={formData.phoneCountry === '+86' ? '请输入手机号' : 'Enter phone number'}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[#516b55] mb-2">
                            收货地址 (可选)
                        </label>
                        <div className="space-y-3">
                            {formData.address.map((address, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => handleAddressChange(index, e.target.value)}
                                        className="flex-1 p-2 border border-[#516b55] rounded"
                                        placeholder={`收货地址 ${index + 1}`}
                                    />
                                    {formData.address.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAddress(index)}
                                            className="px-2 text-red-500 hover:text-red-700"
                                        >
                                            删除
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddNewAddress}
                                className="text-[#516b55] hover:text-[#3f523f] text-sm flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                新增收货地址
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f] transition-colors"
                    >
                        提交
                    </button>
                </form>
            </div>
        </div>
    )
}