import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClassesModule } from './modules/classes/classes.module';
import { VocabularySetsModule } from './modules/vocabulary-sets/vocabulary-sets.module';
import { VocabulariesModule } from './modules/vocabularies/vocabularies.module';
import { ProgressModule } from './modules/progress/progress.module';
import { StreakModule } from './modules/streak/streak.module';
import { AdminModule } from './modules/admin/admin.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { TtsModule } from './modules/tts/tts.module';

@Module({
    imports: [
        // Config module
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database connection
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST', 'localhost'),
                port: configService.get<number>('DATABASE_PORT', 5432),
                username: configService.get('DATABASE_USERNAME', 'postgres'),
                password: configService.get('DATABASE_PASSWORD', '123456'),
                database: configService.get('DATABASE_NAME', 'nestjs'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.get('NODE_ENV') !== 'production',
                logging: configService.get('NODE_ENV') === 'development',
            }),
        }),

        // Feature modules
        AuthModule,
        UsersModule,
        LanguagesModule,
        TtsModule,
        ClassesModule,
        VocabularySetsModule,
        VocabulariesModule,
        ProgressModule,
        StreakModule,
        AdminModule,
    ],
})
export class AppModule { }
