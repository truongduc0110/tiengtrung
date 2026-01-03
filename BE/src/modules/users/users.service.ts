import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { googleId } });
    }

    async create(data: Partial<User>): Promise<User> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = this.usersRepository.create(data);
        return this.usersRepository.save(user);
    }

    async update(id: number, data: Partial<User>): Promise<User> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        await this.usersRepository.update(id, data);
        return this.findById(id);
    }

    async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
        const refreshTokenHash = refreshToken
            ? await bcrypt.hash(refreshToken, 10)
            : null;
        await this.usersRepository.update(id, { refreshTokenHash });
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }

    async validateRefreshToken(user: User, refreshToken: string): Promise<boolean> {
        if (!user.refreshTokenHash) return false;
        return bcrypt.compare(refreshToken, user.refreshTokenHash);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            select: ['id', 'email', 'name', 'avatar', 'role', 'isVip', 'createdAt'],
        });
    }

    async delete(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
