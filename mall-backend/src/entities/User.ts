import { Entity, PrimaryColumn, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export enum UserRole {
    BUYER = 'buyer',
    MERCHANT = 'merchant'
}

@Entity('user')
export class User extends BaseEntity {
    @PrimaryColumn({ name: 'user_id', type: 'varchar' })
    userId: string;

    @Column({ name: 'clerk_id', type: 'varchar', unique: true })
    clerkId: string;

    @Column({ name: 'username', type: 'varchar' })
    username: string;

    @Column({ name: 'email', type: 'varchar' })
    email: string;

    @Column({ name: 'phone', type: 'varchar', nullable: true })
    phone: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string;

    @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.BUYER })
    role: UserRole;
}