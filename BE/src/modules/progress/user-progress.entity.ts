import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Vocabulary } from '../vocabularies/vocabulary.entity';

@Entity('user_progress')
@Unique(['userId', 'vocabularyId'])
export class UserProgress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    vocabularyId: number;

    @Column({ default: 0 })
    correctCount: number;

    @Column({ default: 0 })
    incorrectCount: number;

    @Column({ default: false })
    isLearned: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastReviewed: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Vocabulary, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vocabularyId' })
    vocabulary: Vocabulary;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
