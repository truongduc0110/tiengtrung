import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { VocabularySetsService } from './vocabulary-sets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVocabularySetDto } from './dto/create-vocabulary-set.dto';
import { UpdateVocabularySetDto } from './dto/update-vocabulary-set.dto';

@Controller('sets')
@UseGuards(JwtAuthGuard)
export class VocabularySetsController {
    constructor(private setsService: VocabularySetsService) { }

    @Post()
    async create(@Request() req, @Body() dto: CreateVocabularySetDto) {
        const set = await this.setsService.create(req.user.id, dto);
        return { success: true, data: set };
    }

    @Get('by-class/:classId')
    async findByClass(@Param('classId') classId: number) {
        const sets = await this.setsService.findByClass(classId);
        return { success: true, data: sets };
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        const set = await this.setsService.findById(id);
        return { success: true, data: set };
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Request() req,
        @Body() dto: UpdateVocabularySetDto,
    ) {
        const set = await this.setsService.update(id, req.user.id, dto);
        return { success: true, data: set };
    }

    @Delete(':id')
    async delete(@Param('id') id: number, @Request() req) {
        await this.setsService.delete(id, req.user.id);
        return { success: true, message: 'Vocabulary set deleted successfully' };
    }

    @Post(':id/copy')
    async copy(
        @Param('id') id: number,
        @Request() req,
        @Body('targetClassId') targetClassId: number,
    ) {
        const set = await this.setsService.copy(id, req.user.id, targetClassId);
        return { success: true, data: set };
    }

    @Get(':id/progress')
    async getProgress(@Param('id') id: number, @Request() req) {
        const progress = await this.setsService.getProgress(id, req.user.id);
        return { success: true, data: progress };
    }
}
