import {
    Controller,
    Post,
    Get,
    Put,
    Body,
    UseGuards,
    Request,
    Res,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const tokens = await this.authService.register(
            registerDto.email,
            registerDto.password,
            registerDto.name,
        );
        return { success: true, data: tokens };
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req) {
        const tokens = await this.authService.login(req.user);
        return { success: true, data: tokens };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        const tokens = await this.authService.refreshTokens(
            refreshTokenDto.userId,
            refreshTokenDto.refreshToken,
        );
        return { success: true, data: tokens };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req) {
        await this.authService.logout(req.user.id);
        return { success: true, message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const profile = await this.authService.getProfile(req.user.id);
        return { success: true, data: profile };
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() body: any) {
        const profile = await this.authService.updateProfile(req.user.id, body);
        return { success: true, data: profile };
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // Redirects to Google
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Request() req, @Res() res: Response) {
        const tokens = await this.authService.login(req.user);
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        res.redirect(
            `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
        );
    }
}
