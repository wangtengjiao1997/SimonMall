'use client'
import { useState } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface FormData {
    username: string;
    email: string;
    phoneCountry: string;
    phone: string;
    address: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    phone?: string;
    address?: string;
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
        phoneCountry: '+86', // 默认中国
        phone: '',
        address: ''
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const { user } = useUser()
    const { getToken } = useAuth()
    const router = useRouter()

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // 用户名验证：2-20个字符
        if (!formData.username || formData.username.length < 2 || formData.username.length > 20) {
            newErrors.username = '用户名必须在2-20个字符之间'
        }

        // 邮箱验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = '请输入有效的邮箱地址'
        }

        // 电话号码验证
        if (formData.phone) {
            let isValid = false
            const phoneNumber = formData.phone.replace(/\s+/g, '') // 移除空格

            switch (formData.phoneCountry) {
                case '+86': // 中国
                    isValid = /^1[3-9]\d{9}$/.test(phoneNumber)
                    break
                case '+1': // 美国/加拿大
                    isValid = /^\d{10}$/.test(phoneNumber)
                    break
                default: // 其他国家
                    isValid = /^\d{6,15}$/.test(phoneNumber) // 通用验证：6-15位数字
            }

            if (!isValid) {
                newErrors.phone = '请输入有效的电话号码'
            }
        }

        // 地址验证：最少5个字符
        if (formData.address && formData.address.length < 5) {
            newErrors.address = '地址至少需要5个字符'
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
                    // 合并国家代码和电话号码
                    phone: formData.phone ? `${formData.phoneCountry}${formData.phone}` : ''
                })
            })

            if (response.ok) {
                router.push('/dashboard')
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
                            地址
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-[#516b55]'}`}
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
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