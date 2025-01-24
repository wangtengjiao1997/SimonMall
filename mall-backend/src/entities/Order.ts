import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { OrderItem } from './OrderItem';

@Entity('order')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
    orderId: string;

    @Column({ name: 'user_id', type: 'varchar' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'total_price', type: 'numeric', precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean;

    @Column({ name: 'status', type: 'varchar' })
    status: string;

    @Column({ name: 'shipping_address', type: 'varchar' })
    shippingAddress: string;

    @Column({ name: 'recipient_name', type: 'varchar' })
    recipientName: string;

    @Column({ name: 'recipient_phone', type: 'varchar' })
    recipientPhone: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];
}