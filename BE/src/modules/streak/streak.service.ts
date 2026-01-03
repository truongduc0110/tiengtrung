import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserActivityLog } from './user-activity-log.entity';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class StreakService {
    constructor(
        @InjectRepository(UserActivityLog)
        private activityRepository: Repository<UserActivityLog>,
        private progressService: ProgressService,
    ) { }

    async logActivity(userId: number): Promise<void> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let log = await this.activityRepository.findOne({
            where: { userId, date: today },
        });

        if (!log) {
            log = this.activityRepository.create({
                userId,
                date: today,
                activityCount: 1,
                lastActivityAt: new Date(),
            });
        } else {
            log.activityCount++;
            log.lastActivityAt = new Date();
        }

        await this.activityRepository.save(log);
    }

    async getStreak(userId: number): Promise<number> {
        const logs = await this.activityRepository.find({
            where: { userId },
            order: { date: 'DESC' },
        });

        if (logs.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if user has activity today
        const hasToday = logs.some((log) => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === today.getTime();
        });

        const startDate = hasToday ? today : new Date(today.getTime() - 86400000);

        for (let i = 0; i < logs.length; i++) {
            const expectedDate = new Date(startDate.getTime() - i * 86400000);
            expectedDate.setHours(0, 0, 0, 0);

            const logDate = new Date(logs[i].date);
            logDate.setHours(0, 0, 0, 0);

            if (logDate.getTime() === expectedDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    async getCalendar(userId: number, days: number = 98): Promise<any[]> {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - days * 86400000);

        const logs = await this.activityRepository.find({
            where: {
                userId,
                date: Between(startDate, endDate),
            },
            order: { date: 'ASC' },
        });

        return logs.map((log) => ({
            date: log.date,
            activityCount: log.activityCount,
        }));
    }

    async getLeaderboard(limit: number = 10): Promise<any[]> {
        try {
            const users = await this.activityRepository
                .createQueryBuilder('log')
                .select('log.userId', 'userId')
                .addSelect('COUNT(log.id)', 'totalDays')
                .leftJoin('log.user', 'user')
                .addSelect('user.name', 'name')
                .addSelect('user.avatar', 'avatar')
                .groupBy('log.userId')
                .addGroupBy('user.name')
                .addGroupBy('user.avatar')
                .orderBy('"totalDays"', 'DESC')
                .limit(limit)
                .getRawMany();

            return users;
        } catch (error) {
            console.error('Leaderboard query error:', error);
            return [];
        }
    }

    async getStats(userId: number): Promise<{ streak: number; totalLearned: number }> {
        const streak = await this.getStreak(userId);
        const totalLearned = await this.progressService.countTotalLearned(userId);
        return { streak, totalLearned };
    }
}
