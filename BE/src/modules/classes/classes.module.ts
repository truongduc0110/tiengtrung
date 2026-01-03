import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { ClassMember } from './class-member.entity';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
    imports: [TypeOrmModule.forFeature([Class, ClassMember])],
    controllers: [ClassesController],
    providers: [ClassesService],
    exports: [ClassesService],
})
export class ClassesModule { }
