import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Class } from '../classes/class.entity';
import { User } from '../users/user.entity';
import { Vocabulary } from '../vocabularies/vocabulary.entity';

@Entity('vocabulary_sets')
export class VocabularySet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    icon: string;

    @Column()
    classId: number;

    @Column()
    createdById: number;

    @Column({ default: false })
    isPublic: boolean;

    @ManyToOne(() => Class, (cls) => cls.vocabularySets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'classId' })
    class: Class;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdById' })
    createdBy: User;

    @OneToMany(() => Vocabulary, (vocab) => vocab.vocabularySet)
    vocabularies: Vocabulary[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
