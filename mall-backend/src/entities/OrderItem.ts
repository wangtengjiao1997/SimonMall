import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Order } from './Order';
import { ShoppingEvent } from './ShoppingEvent';
import { Product } from './Product';

@Entity('order_item')
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'order_item_id' })
    orderItemId: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId: string;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'event_id', type: 'uuid' })
    shoppingEventId: string;

    @ManyToOne(() => ShoppingEvent)
    @JoinColumn({ name: 'event_id' })
    shoppingEvent: ShoppingEvent;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'quantity', type: 'integer' })
    quantity: number;

    @Column({ name: 'status', type: 'varchar', length: 20 })
    status: string;

    @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
    price: number;
}