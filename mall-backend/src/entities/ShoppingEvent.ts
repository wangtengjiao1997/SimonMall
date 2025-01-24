import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Merchant } from './Merchant';
import { EventProduct } from './EventProduct';

@Entity('shopping_event')
export class ShoppingEvent extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'event_id' })
    eventId: string;

    @Column({ name: 'merchant_id', type: 'varchar' })
    merchantId: string;

    @ManyToOne(() => Merchant)
    @JoinColumn({ name: 'merchant_id' })
    merchant: Merchant;

    @OneToMany(() => EventProduct, eventProduct => eventProduct.event)
    eventProducts: EventProduct[];

    @Column({ name: 'event_name', type: 'varchar' })
    eventName: string;

    @Column({ name: 'event_description', type: 'text' })
    eventDescription: string;

    @Column({ name: 'status', type: 'varchar' })
    status: string;

    @Column({ name: 'start_time', type: 'timestamp' })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamp' })
    endTime: Date;
}