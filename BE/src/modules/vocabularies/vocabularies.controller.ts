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
import { VocabulariesService } from './vocabularies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

@Controller('vocabularies')
@UseGuards(JwtAuthGuard)
export class VocabulariesController {
    constructor(private vocabService: VocabulariesService) { }

    @Post()
    async create(@Body() dto: CreateVocabularyDto) {
        const vocab = await this.vocabService.create(dto);
        return { success: true, data: vocab };
    }

    @Post('bulk')
    async createBulk(@Body() dtos: CreateVocabularyDto[]) {
        const vocabs = await this.vocabService.createBulk(dtos);
        return { success: true, data: vocabs };
    }

    @Get('by-set/:setId')
    async findBySet(@Param('setId') setId: number, @Request() req) {
        const vocabs = await this.vocabService.findBySet(setId, req.user.id);
        return { success: true, data: vocabs };
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        const vocab = await this.vocabService.findById(id);
        return { success: true, data: vocab };
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateVocabularyDto) {
        const vocab = await this.vocabService.update(id, dto);
        return { success: true, data: vocab };
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.vocabService.delete(id);
        return { success: true, message: 'Vocabulary deleted successfully' };
    }

    @Delete('bulk')
    async deleteBulk(@Body('ids') ids: number[]) {
        await this.vocabService.deleteBulk(ids);
        return { success: true, message: 'Vocabularies deleted successfully' };
    }

    @Post(':id/toggle-learned')
    async toggleLearned(@Param('id') id: number, @Request() req) {
        const isLearned = await this.vocabService.toggleLearned(id, req.user.id);
        return { success: true, data: { isLearned } };
    }

    @Get('quiz/:setId')
    async getQuiz(@Param('setId') setId: number, @Query('count') count: number) {
        const questions = await this.vocabService.getQuizQuestions(setId, count);
        return { success: true, data: questions };
    }

    @Post('check-answer')
    async checkAnswer(
        @Body('vocabularyId') vocabId: number,
        @Body('answer') answer: string,
        @Request() req,
    ) {
        const isCorrect = await this.vocabService.checkAnswer(vocabId, answer, req.user.id);
        return { success: true, data: { isCorrect } };
    }
}
