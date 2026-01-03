import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgress } from './user-progress.entity';
import { ProgressService } from './progress.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserProgress])],
    providers: [ProgressService],
    exports: [ProgressService],
})
export class ProgressModule { }
