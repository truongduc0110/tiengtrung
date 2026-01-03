import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './vocabulary.entity';
import { VocabulariesController } from './vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';
import { ProgressModule } from '../progress/progress.module';

@Module({
    imports: [TypeOrmModule.forFeature([Vocabulary]), ProgressModule],
    controllers: [VocabulariesController],
    providers: [VocabulariesService],
    exports: [VocabulariesService],
})
export class VocabulariesModule { }
