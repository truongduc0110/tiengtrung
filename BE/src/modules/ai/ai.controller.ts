import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(private aiService: AiService) { }

    @Post('generate-vocabulary')
    async generateVocabulary(
        @Body('topic') topic: string,
        @Body('count') count: number = 10,
    ) {
        const vocabularies = await this.aiService.generateVocabulary(topic, count);
        return { success: true, data: vocabularies };
    }

    @Post('suggest-pinyin')
    async suggestPinyin(@Body('chinese') chinese: string) {
        const pinyin = await this.aiService.suggestPinyin(chinese);
        return { success: true, data: { pinyin } };
    }
}
