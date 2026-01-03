import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserProgress } from './user-progress.entity';

@Injectable()
export class ProgressService {
    constructor(
        @InjectRepository(UserProgress)
        private progressRepository: Repository<UserProgress>,
    ) { }

    async getProgress(userId: number, vocabularyId: number): Promise<UserProgress | null> {
        return this.progressRepository.findOne({
            where: { userId, vocabularyId },
        });
    }

    async updateProgress(userId: number, vocabularyId: number, isCorrect: boolean): Promise<UserProgress> {
        let progress = await this.getProgress(userId, vocabularyId);

        if (!progress) {
            progress = this.progressRepository.create({
                userId,
                vocabularyId,
                correctCount: 0,
                incorrectCount: 0,
                isLearned: false,
            });
        }

        if (isCorrect) {
            progress.correctCount++;
            // Auto-mark as learned after 3 correct answers
            if (progress.correctCount >= 3) {
                progress.isLearned = true;
            }
        } else {
            progress.incorrectCount++;
        }

        progress.lastReviewed = new Date();
        return this.progressRepository.save(progress);
    }

    async toggleLearned(userId: number, vocabularyId: number): Promise<boolean> {
        let progress = await this.getProgress(userId, vocabularyId);

        if (!progress) {
            progress = this.progressRepository.create({
                userId,
                vocabularyId,
                correctCount: 0,
                incorrectCount: 0,
                isLearned: true,
            });
        } else {
            progress.isLearned = !progress.isLearned;
        }

        await this.progressRepository.save(progress);
        return progress.isLearned;
    }

    async bulkSave(userId: number, results: Array<{ vocabularyId: number; isCorrect: boolean }>): Promise<void> {
        for (const result of results) {
            await this.updateProgress(userId, result.vocabularyId, result.isCorrect);
        }
    }

    async getSetProgress(userId: number, vocabularyIds: number[]): Promise<{ total: number; learned: number }> {
        if (vocabularyIds.length === 0) {
            return { total: 0, learned: 0 };
        }

        const learnedCount = await this.progressRepository.count({
            where: {
                userId,
                vocabularyId: In(vocabularyIds),
                isLearned: true,
            },
        });
        return { total: vocabularyIds.length, learned: learnedCount };
    }

    async countTotalLearned(userId: number): Promise<number> {
        return this.progressRepository.count({
            where: {
                userId,
                isLearned: true,
            },
        });
    }
}
