import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('merchant')
export class Merchant extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'merchant_id' })
    merchantId: string;

    @Column({ name: 'user_id', type: 'varchar' })
    userId: string;

    @Column({ name: 'shop_name', type: 'varchar' })
    shopName: string;

    @Column({ name: 'shop_description', type: 'text', nullable: true })
    shopDescription: string;

    @Column({ name: 'shop_status', type: 'varchar', default: 'pending' })
    shopStatus: string;

    @Column({ name: 'shop_category', type: 'varchar' })
    shopCategory: string;
}