import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Product } from './Product';
import { ShoppingEvent } from './ShoppingEvent';

@Entity('event_product')
export class EventProduct extends BaseEntity {
    @PrimaryColumn({ name: 'ep_id', type: 'varchar' })
    epId: string;

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

    @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'quantity', type: 'integer' })
    quantity: number;
}