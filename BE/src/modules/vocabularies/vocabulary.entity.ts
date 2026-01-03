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
import { VocabularySet } from '../vocabulary-sets/vocabulary-set.entity';

@Entity('vocabularies')
@Unique(['chinese', 'vocabularySetId'])
export class Vocabulary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chinese: string;

    @Column({ nullable: true })
    pinyin: string;

    @Column()
    meaning: string;

    @Column({ nullable: true })
    example: string;

    @Column({ nullable: true })
    partOfSpeech: string;

    @Column({ nullable: true })
    audio: string;

    @Column()
    vocabularySetId: number;

    @ManyToOne(() => VocabularySet, (set) => set.vocabularies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vocabularySetId' })
    vocabularySet: VocabularySet;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
