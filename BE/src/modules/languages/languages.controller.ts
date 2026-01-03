import { Controller, Get, Param } from '@nestjs/common';
import { LanguagesService } from './languages.service';

@Controller('languages')
export class LanguagesController {
    constructor(private readonly languagesService: LanguagesService) { }

    @Get()
    async findAll() {
        return this.languagesService.findAll();
    }

    @Get(':code')
    async findByCode(@Param('code') code: string) {
        return this.languagesService.findByCode(code);
    }
}
