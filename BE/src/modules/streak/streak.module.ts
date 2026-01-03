import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityLog } from './user-activity-log.entity';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { ProgressModule } from '../progress/progress.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserActivityLog]),
        ProgressModule,
    ],
    controllers: [StreakController],
    providers: [StreakService],
    exports: [StreakService],
})
export class StreakModule { }
