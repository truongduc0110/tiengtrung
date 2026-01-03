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

    @ManyToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @OneToMany(() => ClassMember, (member) => member.class)
    members: ClassMember[];

    @OneToMany(() => VocabularySet, (set) => set.class)
    vocabularySets: VocabularySet[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
