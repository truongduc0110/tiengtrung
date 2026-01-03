import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vocabulary } from './vocabulary.entity';
import { ProgressService } from '../progress/progress.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

@Injectable()
export class VocabulariesService {
    constructor(
        @InjectRepository(Vocabulary)
        private vocabRepository: Repository<Vocabulary>,
        private progressService: ProgressService,
    ) { }

    async create(dto: CreateVocabularyDto): Promise<Vocabulary> {
        const vocab = this.vocabRepository.create(dto);
        return this.vocabRepository.save(vocab);
    }

    async createBulk(dtos: CreateVocabularyDto[]): Promise<Vocabulary[]> {
        const vocabs = this.vocabRepository.create(dtos);
        return this.vocabRepository.save(vocabs);
    }

    async findBySet(setId: number, userId?: number): Promise<any[]> {
        const vocabs = await this.vocabRepository.find({
            where: { vocabularySetId: setId },
            order: { createdAt: 'ASC' },
        });

        if (userId) {
            // Add progress info to each vocabulary
            const vocabsWithProgress = await Promise.all(
                vocabs.map(async (vocab) => {
                    const progress = await this.progressService.getProgress(userId, vocab.id);
                    return {
                        ...vocab,
                        isLearned: progress?.isLearned || false,
                        correctCount: progress?.correctCount || 0,
                        incorrectCount: progress?.incorrectCount || 0,
                    };
                }),
            );
            return vocabsWithProgress;
        }

        return vocabs;
    }

    async findById(id: number): Promise<Vocabulary> {
        const vocab = await this.vocabRepository.findOne({ where: { id } });
        if (!vocab) {
            throw new NotFoundException('Vocabulary not found');
        }
        return vocab;
    }

    async update(id: number, dto: UpdateVocabularyDto): Promise<Vocabulary> {
        const vocab = await this.findById(id);
        Object.assign(vocab, dto);
        return this.vocabRepository.save(vocab);
    }

    async delete(id: number): Promise<void> {
        await this.vocabRepository.delete(id);
    }

    async deleteBulk(ids: number[]): Promise<void> {
        await this.vocabRepository.delete({ id: In(ids) });
    }

    async toggleLearned(vocabId: number, userId: number): Promise<boolean> {
        return this.progressService.toggleLearned(userId, vocabId);
    }

    async getQuizQuestions(setId: number, count: number = 10): Promise<any[]> {
        const vocabs = await this.vocabRepository.find({
            where: { vocabularySetId: setId },
        });

        // Shuffle and take 'count' items
        const shuffled = vocabs.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, vocabs.length));

        return selected.map((vocab) => {
            // Generate 3 wrong options
            const wrongOptions = shuffled
                .filter((v) => v.id !== vocab.id)
                .slice(0, 3)
                .map((v) => v.meaning);

            const options = [...wrongOptions, vocab.meaning].sort(() => Math.random() - 0.5);

            return {
                id: vocab.id,
                question: vocab.chinese,
                pinyin: vocab.pinyin,
                correctAnswer: vocab.meaning,
                options,
            };
        });
    }

    async checkAnswer(vocabId: number, answer: string, userId: number): Promise<boolean> {
        const vocab = await this.findById(vocabId);
        const isCorrect = vocab.meaning.toLowerCase() === answer.toLowerCase();

        // Update progress
        await this.progressService.updateProgress(userId, vocabId, isCorrect);

        return isCorrect;
    }
}
