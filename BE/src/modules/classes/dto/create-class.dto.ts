import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateClassDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsNumber()
    languageId: number;
}
