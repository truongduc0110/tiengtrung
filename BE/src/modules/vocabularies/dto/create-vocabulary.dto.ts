import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateVocabularyDto {
    @IsString()
    word: string;

    @IsOptional()
    @IsString()
    pronunciation?: string;

    @IsOptional()
    @IsString()
    pronunciation2?: string;

    @IsString()
    meaning: string;

    @IsOptional()
    @IsString()
    example?: string;

    @IsOptional()
    @IsString()
    partOfSpeech?: string;

    @IsNumber()
    vocabularySetId: number;
}
