import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Merchant } from './Merchant';

@Entity('shopping_event')
export class ShoppingEvent extends BaseEntity {
    @PrimaryColumn({ name: 'event_id', type: 'varchar' })
    eventId: string;

    @Column({ name: 'merchant_id', type: 'varchar' })
    merchantId: string;

    @ManyToOne(() => Merchant)
    @JoinColumn({ name: 'merchant_id' })
    merchant: Merchant;

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