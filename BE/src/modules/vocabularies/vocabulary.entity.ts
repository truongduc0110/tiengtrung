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
@Unique(['word', 'vocabularySetId'])
export class Vocabulary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    word: string; // Từ gốc: hello, 你好, こんにちは, 안녕

    @Column({ nullable: true })
    pronunciation: string; // Phiên âm chính: IPA, pinyin, hiragana, romaja

    @Column({ nullable: true })
    pronunciation2: string; // Phiên âm phụ: romaji cho tiếng Nhật

    @Column()
    meaning: string; // Nghĩa tiếng Việt

    @Column({ nullable: true })
    example: string;

    @Column({ nullable: true })
    partOfSpeech: string;

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
