'use client'
import Link from 'next/link'
import { SignInButton, useUser, UserButton, useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function Navbar() {
    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()

    useEffect(() => {
        if (user) {
            // 获取 JWT token
            const initUser = async () => {
                try {
                    const token = await getToken()
                    console.log('JWT Token:', token)
                } catch (error) {
                    console.error('获取 token 失败:', error)
                }
            }

            initUser()
        }
    }, [user, getToken])

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
                        <li>
                            <button onClick={async () => {
                                fetch('http://localhost:3001/api/v1/users/test1', {
                                    headers: { Authorization: `Bearer ${await getToken()}` },
                                }).then((res) => console.log(res.json()))
                            }}>
                                test
                            </button>
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