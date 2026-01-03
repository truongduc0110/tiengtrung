import { IsString, IsOptional, IsBoolean } from 'class-validator';

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
}
