import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity('merchant')
export class Merchant extends BaseEntity {
    @PrimaryColumn({ name: 'merchant_id', type: 'varchar' })
    merchantId: string;

    @Column({ name: 'user_id', type: 'varchar' })
    userId: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'shop_name', type: 'varchar' })
    shopName: string;

    @Column({ name: 'shop_description', type: 'text' })
    shopDescription: string;

    @Column({ name: 'shop_status', type: 'text' })
    shopStatus: string;

    @Column({ name: 'shop_category', type: 'text' })
    shopCategory: string;
}