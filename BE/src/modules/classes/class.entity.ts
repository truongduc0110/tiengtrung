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
import { User } from '../users/user.entity';
import { ClassMember } from './class-member.entity';
import { VocabularySet } from '../vocabulary-sets/vocabulary-set.entity';
import { Language } from '../languages/language.entity';

@Entity('classes')
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ unique: true })
    code: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ default: false })
    isPublic: boolean;

    @Column()
    ownerId: number;

    @Column()
    languageId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @ManyToOne(() => Language)
    @JoinColumn({ name: 'languageId' })
    language: Language;

    @OneToMany(() => ClassMember, (member) => member.class)
    members: ClassMember[];

    @OneToMany(() => VocabularySet, (set) => set.class)
    vocabularySets: VocabularySet[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
