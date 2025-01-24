import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ShoppingEvent } from './ShoppingEvent';
import { Product } from './Product';

@Entity('event_product')
export class EventProduct extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'ep_id' })
    epId: string;

    @Column({ name: 'event_id', type: 'uuid' })
    eventId: string;

    @ManyToOne(() => ShoppingEvent)
    @JoinColumn({ name: 'event_id' })
    event: ShoppingEvent;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'quantity', type: 'integer' })
    quantity: number;

    @Column({ name: 'limit_per_user', type: 'integer' })
    limitPerUser: number;
}
