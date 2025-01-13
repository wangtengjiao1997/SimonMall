import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('product')
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'product_id' })
    productId: string;

    @Column({ name: 'merchant_id', type: 'varchar' })
    merchantId: string;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'category', type: 'varchar' })
    category: string;

    @Column({ name: 'image_url', type: 'text', nullable: true })
    imageUrl: string;

    @Column({ name: 'rank', type: 'integer', default: 0 })
    rank: number;
}