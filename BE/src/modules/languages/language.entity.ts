import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('languages')
export class Language {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 10 })
    code: string; // 'en', 'zh', 'ja', 'ko'

    @Column({ length: 50 })
    name: string; // 'English', 'Chinese', 'Japanese', 'Korean'

    @Column({ length: 50 })
    nativeName: string; // 'English', '中文', '日本語', '한국어'

    @Column({ length: 10 })
    flag: string; // '🇬🇧', '🇨🇳', '🇯🇵', '🇰🇷'

    @Column({ length: 20 })
    ttsVoice: string; // 'en-US', 'zh-CN', 'ja-JP', 'ko-KR'

    @CreateDateColumn()
    createdAt: Date;
}
