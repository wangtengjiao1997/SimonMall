'use client'
import Link from 'next/link'
import { SignInButton, useUser, UserButton, useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            const initUser = async () => {
                try {
                    const token = await getToken()
                    // 检查用户信息
                    const response = await fetch('http://localhost:3001/api/v1/users/checkUserProfile', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    const data = await response.json()
                    
                    if (data.success && !data.data.exists) {
                        router.push('/register')
                    }
                } catch (error) {
                    console.error('获取用户信息失败:', error)
                }
            }

            initUser()
        }
    }, [user, getToken, router])

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex justify-between items-center p-6">
                <nav className="backdrop-blur-[2px]">
                    <ul className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-16 text-[#516b55] font-light text-base md:text-lg">
                        <li>
                            <Link href="/shop" className="hover:opacity-70 transition-opacity tracking-wider">
                                SHOP
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:opacity-70 transition-opacity tracking-wider">
                                ABOUT
                            </Link>
                        </li>
                        <li>
                            <Link href="/stockists" className="hover:opacity-70 transition-opacity tracking-wider">
                                STOCKISTS
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:opacity-70 transition-opacity tracking-wider">
                                ABOUT
                            </Link>
                        </li>
                    </ul>
                </nav>
                {isLoaded && (
                    user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-[#516b55]">
                                {user.firstName || user.emailAddresses[0].emailAddress}
                            </span>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 text-[#516b55] hover:bg-[#516b55] hover:text-white rounded-md transition-all duration-300 border border-[#516b55]">
                                登录
                            </button>
                        </SignInButton>
                    )
                )}
            </div>
        </header>
    )
}