import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Cart } from './Cart';
import { Product } from './Product';

@Entity('cart_items')
export class CartItem extends BaseEntity {
    @PrimaryColumn({ name: 'cart_item_id', type: 'varchar' })
    cartItemId: string;

    @Column({ name: 'cart_id', type: 'varchar' })
    cartId: string;

    @ManyToOne(() => Cart)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @Column({ name: 'product_id', type: 'varchar' })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'quantity', type: 'int' })
    quantity: number;
}