import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabularySet } from './vocabulary-set.entity';
import { ClassesService } from '../classes/classes.service';
import { CreateVocabularySetDto } from './dto/create-vocabulary-set.dto';
import { UpdateVocabularySetDto } from './dto/update-vocabulary-set.dto';

@Injectable()
export class VocabularySetsService {
    constructor(
        @InjectRepository(VocabularySet)
        private setRepository: Repository<VocabularySet>,
        private classesService: ClassesService,
    ) { }

    async create(userId: number, dto: CreateVocabularySetDto): Promise<VocabularySet> {
        // Verify user is member of the class
        const isMember = await this.classesService.isMember(userId, dto.classId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this class');
        }

        const set = this.setRepository.create({
            ...dto,
            createdById: userId,
        });
        return this.setRepository.save(set);
    }

    async findByClass(classId: number): Promise<VocabularySet[]> {
        return this.setRepository.find({
            where: { classId },
            relations: ['createdBy', 'vocabularies'],
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: number): Promise<VocabularySet> {
        const set = await this.setRepository.findOne({
            where: { id },
            relations: ['createdBy', 'vocabularies', 'class'],
        });
        if (!set) {
            throw new NotFoundException('Vocabulary set not found');
        }
        return set;
    }

    async update(id: number, userId: number, dto: UpdateVocabularySetDto): Promise<VocabularySet> {
        const set = await this.findById(id);
        if (set.createdById !== userId) {
            throw new ForbiddenException('Only the creator can update this set');
        }
        Object.assign(set, dto);
        return this.setRepository.save(set);
    }

    async delete(id: number, userId: number): Promise<void> {
        const set = await this.findById(id);
        if (set.createdById !== userId) {
            throw new ForbiddenException('Only the creator can delete this set');
        }
        await this.setRepository.delete(id);
    }

    async copy(id: number, userId: number, targetClassId: number): Promise<VocabularySet> {
        const original = await this.findById(id);

        // Verify user is member of target class
        const isMember = await this.classesService.isMember(userId, targetClassId);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of the target class');
        }

        const copy = this.setRepository.create({
            name: `${original.name} (Copy)`,
            description: original.description,
            icon: original.icon,
            classId: targetClassId,
            createdById: userId,
        });
        return this.setRepository.save(copy);
    }

    async getProgress(setId: number, userId: number): Promise<{ total: number; learned: number }> {
        const set = await this.findById(setId);
        const total = set.vocabularies?.length || 0;
        // TODO: Calculate learned from UserProgress
        return { total, learned: 0 };
    }
}
