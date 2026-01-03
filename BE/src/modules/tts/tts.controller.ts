import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { TtsService } from './tts.service';

@Controller('tts')
export class TtsController {
    constructor(private readonly ttsService: TtsService) { }

    @Get('speak')
    async speak(
        @Query('text') text: string,
        @Query('lang') lang: string,
    ) {
        if (!text) {
            throw new BadRequestException('Text is required');
        }
        if (!lang) {
            throw new BadRequestException('Language code is required');
        }

        const audioUrl = await this.ttsService.getAudioUrl(text, lang);

        return {
            text,
            languageCode: lang,
            audioUrl,
        };
    }
}
