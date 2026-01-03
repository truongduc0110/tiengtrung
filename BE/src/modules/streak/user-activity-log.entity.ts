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

@Entity('user_activity_logs')
@Unique(['userId', 'date'])
export class UserActivityLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ default: 0 })
    activityCount: number;

    @Column({ type: 'timestamp', nullable: true })
    lastActivityAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}
