import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateVocabularyDto {
    @IsString()
    chinese: string;

    @IsOptional()
    @IsString()
    pinyin?: string;

    @IsString()
    meaning: string;

    @IsOptional()
    @IsString()
    example?: string;

    @IsOptional()
    @IsString()
    partOfSpeech?: string;

    @IsOptional()
    @IsString()
    audio?: string;

    @IsNumber()
    vocabularySetId: number;
}
