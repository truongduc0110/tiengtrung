import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Set global prefix
    app.setGlobalPrefix('api', {
        exclude: ['/', 'auth/google', 'auth/google/callback'],
    });

    const port = process.env.PORT || 8080;
    await app.listen(port);
    console.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap();
