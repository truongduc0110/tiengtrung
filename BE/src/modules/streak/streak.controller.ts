import { Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { StreakService } from './streak.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class StreakController {
    constructor(private streakService: StreakService) { }

    @Post('log')
    async logActivity(@Request() req) {
        await this.streakService.logActivity(req.user.id);
        return { success: true, message: 'Activity logged' };
    }

    @Get('streak')
    async getStreak(@Request() req) {
        const streak = await this.streakService.getStreak(req.user.id);
        return { success: true, data: { streak } };
    }

    @Get('calendar')
    async getCalendar(@Request() req, @Query('days') days: number = 98) {
        const calendar = await this.streakService.getCalendar(req.user.id, days);
        return { success: true, data: calendar };
    }

    @Get('leaderboard')
    async getLeaderboard(@Query('limit') limit: number = 10) {
        const leaderboard = await this.streakService.getLeaderboard(limit);
        return { success: true, data: leaderboard };
    }

    @Get('stats')
    async getStats(@Request() req) {
        const stats = await this.streakService.getStats(req.user.id);
        return { success: true, data: stats };
    }
}
