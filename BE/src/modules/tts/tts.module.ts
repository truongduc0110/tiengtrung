import { Module } from '@nestjs/common';
import { TtsService } from './tts.service';
import { TtsController } from './tts.controller';
import { LanguagesModule } from '../languages/languages.module';

@Module({
    imports: [LanguagesModule],
    controllers: [TtsController],
    providers: [TtsService],
    exports: [TtsService],
})
export class TtsModule { }
