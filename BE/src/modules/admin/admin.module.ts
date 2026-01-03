import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Class } from '../classes/class.entity';
import { VocabularySet } from '../vocabulary-sets/vocabulary-set.entity';
import { Vocabulary } from '../vocabularies/vocabulary.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Class, VocabularySet, Vocabulary])],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
