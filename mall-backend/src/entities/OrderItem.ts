import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Order } from './Order';
import { EventProduct } from './EventProduct';

@Entity('order_item')
export class OrderItem extends BaseEntity {
    @PrimaryColumn({ name: 'order_item_id', type: 'varchar' })
    orderItemId: string;

    @Column({ name: 'order_id', type: 'varchar' })
    orderId: string;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'event_product_id', type: 'varchar' })
    eventProductId: string;

    @ManyToOne(() => EventProduct)
    @JoinColumn({ name: 'event_product_id' })
    eventProduct: EventProduct;

    @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'quantity', type: 'integer' })
    quantity: number;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean;
}