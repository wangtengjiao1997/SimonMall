import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="h-full backdrop-blur-sm bg-transparent">
                <ul className="container mx-auto flex flex-wrap justify-center md:justify-start gap-8 md:gap-16 text-[#516b55] font-light text-base md:text-lg p-6">
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
            </div>
        </nav>
    )
}