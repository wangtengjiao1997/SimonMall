import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity('order')
export class Order extends BaseEntity {
    @PrimaryColumn({ name: 'order_id', type: 'varchar' })
    orderId: string;

    @Column({ name: 'user_id', type: 'varchar' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'total_price', type: 'numeric', precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ name: 'order_status', type: 'integer' })
    orderStatus: number;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean;
}