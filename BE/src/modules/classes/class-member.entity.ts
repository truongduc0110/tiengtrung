import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Class } from './class.entity';

export enum MemberRole {
    OWNER = 'owner',
    MEMBER = 'member',
}

@Entity('class_members')
@Unique(['userId', 'classId'])
export class ClassMember {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    classId: number;

    @Column({ type: 'enum', enum: MemberRole, default: MemberRole.MEMBER })
    role: MemberRole;

    @ManyToOne(() => User, (user) => user.classMembers)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Class, (cls) => cls.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'classId' })
    class: Class;

    @CreateDateColumn()
    joinedAt: Date;
}
