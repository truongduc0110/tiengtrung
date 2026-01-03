import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { ClassMember, MemberRole } from './class-member.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        @InjectRepository(ClassMember)
        private memberRepository: Repository<ClassMember>,
    ) { }

    private generateCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    async create(userId: number, dto: CreateClassDto): Promise<Class> {
        if (!userId) {
            throw new ForbiddenException('User not authenticated');
        }

        const code = this.generateCode();
        const newClass = this.classRepository.create({
            ...dto,
            code,
            ownerId: userId,
        });
        const savedClass = await this.classRepository.save(newClass);

        // Add owner as member
        await this.memberRepository.save({
            userId,
            classId: savedClass.id,
            role: MemberRole.OWNER,
        });

        return savedClass;
    }

    async findAllByUser(userId: number): Promise<Class[]> {
        const memberships = await this.memberRepository.find({
            where: { userId },
            relations: ['class', 'class.owner'],
        });
        return memberships.map((m) => m.class);
    }

    async findById(id: number): Promise<Class> {
        const cls = await this.classRepository.findOne({
            where: { id },
            relations: ['owner', 'members', 'members.user', 'vocabularySets'],
        });
        if (!cls) {
            throw new NotFoundException('Class not found');
        }
        return cls;
    }

    async update(id: number, userId: number, dto: UpdateClassDto): Promise<Class> {
        const cls = await this.findById(id);
        if (cls.ownerId !== userId) {
            throw new ForbiddenException('Only the owner can update this class');
        }
        Object.assign(cls, dto);
        return this.classRepository.save(cls);
    }

    async delete(id: number, userId: number): Promise<void> {
        const cls = await this.findById(id);
        if (cls.ownerId !== userId) {
            throw new ForbiddenException('Only the owner can delete this class');
        }
        await this.classRepository.delete(id);
    }

    async join(userId: number, code: string): Promise<Class> {
        const cls = await this.classRepository.findOne({ where: { code } });
        if (!cls) {
            throw new NotFoundException('Class not found with this code');
        }

        const existingMember = await this.memberRepository.findOne({
            where: { userId, classId: cls.id },
        });
        if (existingMember) {
            throw new ConflictException('You are already a member of this class');
        }

        await this.memberRepository.save({
            userId,
            classId: cls.id,
            role: MemberRole.MEMBER,
        });

        return cls;
    }

    async leave(id: number, userId: number): Promise<void> {
        const cls = await this.findById(id);
        if (cls.ownerId === userId) {
            throw new ForbiddenException('Owner cannot leave the class. Delete it instead.');
        }

        const member = await this.memberRepository.findOne({
            where: { userId, classId: id },
        });
        if (!member) {
            throw new NotFoundException('You are not a member of this class');
        }

        await this.memberRepository.delete(member.id);
    }

    async getMembers(id: number): Promise<ClassMember[]> {
        return this.memberRepository.find({
            where: { classId: id },
            relations: ['user'],
        });
    }

    async isMember(userId: number, classId: number): Promise<boolean> {
        const member = await this.memberRepository.findOne({
            where: { userId, classId },
        });
        return !!member;
    }
}
