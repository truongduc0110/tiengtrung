import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Class } from '../classes/class.entity';
import { VocabularySet } from '../vocabulary-sets/vocabulary-set.entity';
import { Vocabulary } from '../vocabularies/vocabulary.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        @InjectRepository(VocabularySet)
        private setRepository: Repository<VocabularySet>,
        @InjectRepository(Vocabulary)
        private vocabRepository: Repository<Vocabulary>,
    ) { }

    async getStatistics(): Promise<any> {
        const [usersCount, classesCount, setsCount, vocabsCount] = await Promise.all([
            this.userRepository.count(),
            this.classRepository.count(),
            this.setRepository.count(),
            this.vocabRepository.count(),
        ]);

        return {
            users: usersCount,
            classes: classesCount,
            vocabularySets: setsCount,
            vocabularies: vocabsCount,
        };
    }

    async getUsers(): Promise<User[]> {
        return this.userRepository.find({
            select: ['id', 'email', 'name', 'avatar', 'role', 'isVip', 'createdAt'],
            order: { createdAt: 'DESC' },
        });
    }

    async getClasses(): Promise<Class[]> {
        return this.classRepository.find({
            relations: ['owner', 'members'],
            order: { createdAt: 'DESC' },
        });
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async deleteClass(id: number): Promise<void> {
        await this.classRepository.delete(id);
    }
}
