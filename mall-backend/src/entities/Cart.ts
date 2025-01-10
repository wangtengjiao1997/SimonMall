import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity('cart')
export class Cart extends BaseEntity {
    @PrimaryColumn({ name: 'cart_id', type: 'varchar' })
    cartId: string;

    @Column({ name: 'user_id', type: 'varchar' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}