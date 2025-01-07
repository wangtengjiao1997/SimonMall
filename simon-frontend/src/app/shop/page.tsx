'use client'
import { motion } from 'framer-motion'

interface Product {
    id: number
    name: string
    price: number
    image: string
    description: string
}

const products: Product[] = [
    {
        id: 1,
        name: "Natural Red Wine",
        price: 29.99,
        image: "/wine1.jpg", // 需要添加实际图片
        description: "A beautiful natural red wine with fruity notes"
    },
    {
        id: 2,
        name: "Orange Wine",
        price: 34.99,
        image: "/wine2.jpg",
        description: "Unique orange wine with complex flavors"
    },
    // 可以添加更多产品
]

export default function Shop() {
    return (
        <main className="min-h-screen p-4 md:p-8 pt-24">
            <div className="container mx-auto mt-20">
                <h1 className="text-3xl md:text-4xl text-[#516b55] font-serif text-center mb-12">
                    Our Collection
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="relative aspect-square mb-4 bg-[#516b55]/10 rounded-lg">
                                {/* 产品图片占位符 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-48 bg-[#ff7f50] rounded-lg transform -rotate-6" />
                                </div>
                            </div>
                            <h2 className="text-xl font-serif text-[#516b55] mb-2">{product.name}</h2>
                            <p className="text-[#516b55]/80 mb-4">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-medium text-[#516b55]">${product.price}</span>
                                <button className="px-4 py-2 bg-[#516b55] text-white rounded-md hover:bg-opacity-80 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    )
}