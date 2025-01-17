import { useState } from 'react'
import { Product } from '@/model/product'
import { OrderItem } from '@/model/order'
import anime from 'animejs'

interface CreateOrderProps {
    products: Product[];
    onSubmit: (orderData: any) => Promise<void>;
}

export default function CreateOrder({ products, onSubmit }: CreateOrderProps) {
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: ''
    })

    const handleAddItem = (product: Product) => {
        const existingItem = selectedItems.find(item => item.productId === product.productId)
        if (existingItem) {
            setSelectedItems(items =>
                items.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            )
        } else {
            const newItem: OrderItem = {
                productId: product.productId!,
                name: product.name,
                price: Number(product.price),
                quantity: 1,
                imageUrl: product.imageUrl
            }
            setSelectedItems([...selectedItems, newItem])

            // 添加动画效果
            anime({
                targets: '.selected-items',
                translateX: [20, 0],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            })
        }
    }

    // ... 继续下一部分代码
}