import { Entity, PrimaryColumn, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('product')
export class Product extends BaseEntity {
    @PrimaryColumn({ name: 'product_id', type: 'varchar' })
    productId: string;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'category', type: 'varchar' })
    category: string;

    @Column({ name: 'image_url', type: 'text' })
    imageUrl: string;

    @Column({ name: 'rank', type: 'integer' })
    rank: number;
}