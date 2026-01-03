import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateVocabularySetDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsNumber()
    classId: number;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}
