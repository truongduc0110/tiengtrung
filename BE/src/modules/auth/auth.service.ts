import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

export interface TokenPayload {
    sub: number;
    email: string;
    role: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (user && await this.usersService.validatePassword(user, password)) {
            return user;
        }
        return null;
    }

    async register(email: string, password: string, name?: string): Promise<AuthTokens> {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const user = await this.usersService.create({ email, password, name });
        return this.generateTokens(user);
    }

    async login(user: User): Promise<AuthTokens> {
        return this.generateTokens(user);
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<AuthTokens> {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isValid = await this.usersService.validateRefreshToken(user, refreshToken);
        if (!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return this.generateTokens(user);
    }

    async logout(userId: number): Promise<void> {
        await this.usersService.updateRefreshToken(userId, null);
    }

    async validateGoogleUser(profile: any): Promise<User> {
        const { id: googleId, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const avatar = photos?.[0]?.value;

        let user = await this.usersService.findByGoogleId(googleId);
        if (!user) {
            user = await this.usersService.findByEmail(email);
            if (user) {
                // Link Google to existing account
                await this.usersService.update(user.id, { googleId, avatar: avatar || user.avatar });
                user = await this.usersService.findById(user.id);
            } else {
                // Create new user
                user = await this.usersService.create({
                    email,
                    googleId,
                    name: displayName,
                    avatar,
                });
            }
        }
        return user;
    }

    private async generateTokens(user: User): Promise<AuthTokens> {
        const payload: TokenPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '7d'),
        });

        await this.usersService.updateRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    async getProfile(userId: number): Promise<Partial<User>> {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const { password, refreshTokenHash, ...profile } = user;
        return profile;
    }

    async updateProfile(userId: number, data: Partial<User>): Promise<Partial<User>> {
        const { password, refreshTokenHash, role, ...allowedData } = data as any;
        await this.usersService.update(userId, allowedData);
        return this.getProfile(userId);
    }
}
