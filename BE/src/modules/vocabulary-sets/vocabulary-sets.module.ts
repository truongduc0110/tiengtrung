import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularySet } from './vocabulary-set.entity';
import { VocabularySetsController } from './vocabulary-sets.controller';
import { VocabularySetsService } from './vocabulary-sets.service';
import { ClassesModule } from '../classes/classes.module';

@Module({
    imports: [TypeOrmModule.forFeature([VocabularySet]), ClassesModule],
    controllers: [VocabularySetsController],
    providers: [VocabularySetsService],
    exports: [VocabularySetsService],
})
export class VocabularySetsModule { }
