import { Injectable } from '@nestjs/common';
import { LanguagesService } from '../languages/languages.service';

@Injectable()
export class TtsService {
    constructor(private readonly languagesService: LanguagesService) { }

    async getAudioUrl(text: string, languageCode: string): Promise<string> {
        const language = await this.languagesService.findByCode(languageCode);
        if (!language) {
            throw new Error(`Language not found: ${languageCode}`);
        }

        // Use Google TTS API endpoint
        // This generates audio URL that can be played directly
        const encodedText = encodeURIComponent(text);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${language.ttsVoice}&client=tw-ob&q=${encodedText}`;

        return ttsUrl;
    }

    getTtsVoiceForLanguage(languageCode: string): string {
        const voiceMap: Record<string, string> = {
            'en': 'en-US',
            'zh': 'zh-CN',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
        };
        return voiceMap[languageCode] || 'en-US';
    }
}
