import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Product } from './Product';
import { ShoppingEvent } from './ShoppingEvent';
import { Order } from './Order';

@Entity('selling_product')
export class SellingProduct extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'sp_id' })
    spId: string;

    @Column({ name: 'product_id', type: 'varchar' })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'event_id', type: 'varchar' })
    eventId: string;

    @ManyToOne(() => ShoppingEvent)
    @JoinColumn({ name: 'event_id' })
    event: ShoppingEvent;

    @Column({ name: 'order_id', type: 'varchar' })
    orderId: string;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'quantity', type: 'integer' })
    quantity: number;
}