import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './language.entity';

@Injectable()
export class LanguagesService implements OnModuleInit {
    constructor(
        @InjectRepository(Language)
        private languagesRepository: Repository<Language>,
    ) { }

    async onModuleInit() {
        await this.seedLanguages();
    }

    private async seedLanguages() {
        const count = await this.languagesRepository.count();
        if (count > 0) return;

        const languages = [
            { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', ttsVoice: 'en-US' },
            { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', ttsVoice: 'zh-CN' },
            { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', ttsVoice: 'ja-JP' },
            { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', ttsVoice: 'ko-KR' },
        ];

        await this.languagesRepository.save(languages);
    }

    async findAll(): Promise<Language[]> {
        return this.languagesRepository.find();
    }

    async findByCode(code: string): Promise<Language | null> {
        return this.languagesRepository.findOne({ where: { code } });
    }

    async findById(id: number): Promise<Language | null> {
        return this.languagesRepository.findOne({ where: { id } });
    }
}
