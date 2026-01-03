import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface VocabularyItem {
    chinese: string;
    pinyin: string;
    meaning: string;
    example?: string;
    partOfSpeech?: string;
}

@Injectable()
export class AiService {
    private apiKeys: string[];
    private currentKeyIndex: number = 0;

    constructor(private configService: ConfigService) {
        const keys = this.configService.get('GEMINI_API_KEYS', '');
        this.apiKeys = keys.split(',').filter((k: string) => k.trim());
    }

    private getNextApiKey(): string {
        if (this.apiKeys.length === 0) {
            throw new HttpException('No API keys configured', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const key = this.apiKeys[this.currentKeyIndex];
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        return key;
    }

    async generateVocabulary(topic: string, count: number = 10): Promise<VocabularyItem[]> {
        const apiKey = this.getNextApiKey();

        const prompt = `Tạo ${count} từ vựng tiếng Trung về chủ đề "${topic}". 
Trả về JSON array với format:
[
  {
    "chinese": "chữ Hán",
    "pinyin": "phiên âm pinyin có dấu thanh",
    "meaning": "nghĩa tiếng Việt",
    "example": "câu ví dụ bằng tiếng Trung",
    "partOfSpeech": "loại từ (danh từ, động từ, tính từ...)"
  }
]
Chỉ trả về JSON, không có text khác.`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2048,
                        },
                    }),
                },
            );

            const data = await response.json();

            if (data.error) {
                throw new HttpException(data.error.message, HttpStatus.BAD_REQUEST);
            }

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Extract JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new HttpException('Invalid AI response format', HttpStatus.BAD_REQUEST);
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException('AI service error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async suggestPinyin(chinese: string): Promise<string> {
        const apiKey = this.getNextApiKey();

        const prompt = `Cho biết phiên âm pinyin có dấu thanh của từ tiếng Trung "${chinese}". Chỉ trả về pinyin, không có text khác.`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                },
            );

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        } catch (error) {
            throw new HttpException('AI service error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
