import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ClassMember } from '../classes/class-member.entity';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ default: false })
    isVip: boolean;

    @Column({ type: 'timestamp', nullable: true })
    vipExpiresAt: Date;

    @Column({ nullable: true })
    refreshTokenHash: string;

    @Column({ nullable: true })
    googleId: string;

    @OneToMany(() => ClassMember, (member) => member.user)
    classMembers: ClassMember[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
