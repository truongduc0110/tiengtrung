import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JoinClassDto } from './dto/join-class.dto';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
    constructor(private classesService: ClassesService) { }

    @Post()
    async create(@Request() req, @Body() dto: CreateClassDto) {
        const cls = await this.classesService.create(req.user.id, dto);
        return { success: true, data: cls };
    }

    @Get()
    async findAll(@Request() req) {
        const classes = await this.classesService.findAllByUser(req.user.id);
        return { success: true, data: classes };
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Request() req) {
        const cls = await this.classesService.findById(id);
        return { success: true, data: cls };
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Request() req,
        @Body() dto: UpdateClassDto,
    ) {
        const cls = await this.classesService.update(id, req.user.id, dto);
        return { success: true, data: cls };
    }

    @Delete(':id')
    async delete(@Param('id') id: number, @Request() req) {
        await this.classesService.delete(id, req.user.id);
        return { success: true, message: 'Class deleted successfully' };
    }

    @Post('join')
    async join(@Request() req, @Body() dto: JoinClassDto) {
        const cls = await this.classesService.join(req.user.id, dto.code);
        return { success: true, data: cls };
    }

    @Delete(':id/leave')
    async leave(@Param('id') id: number, @Request() req) {
        await this.classesService.leave(id, req.user.id);
        return { success: true, message: 'Left class successfully' };
    }

    @Get(':id/members')
    async getMembers(@Param('id') id: number) {
        const members = await this.classesService.getMembers(id);
        return { success: true, data: members };
    }
}
