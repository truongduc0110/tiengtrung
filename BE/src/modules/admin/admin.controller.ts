import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('stats')
    async getStatistics() {
        const stats = await this.adminService.getStatistics();
        return { success: true, data: stats };
    }

    @Get('users')
    async getUsers() {
        const users = await this.adminService.getUsers();
        return { success: true, data: users };
    }

    @Get('classes')
    async getClasses() {
        const classes = await this.adminService.getClasses();
        return { success: true, data: classes };
    }

    @Delete('users/:id')
    async deleteUser(@Param('id') id: number) {
        await this.adminService.deleteUser(id);
        return { success: true, message: 'User deleted successfully' };
    }

    @Delete('classes/:id')
    async deleteClass(@Param('id') id: number) {
        await this.adminService.deleteClass(id);
        return { success: true, message: 'Class deleted successfully' };
    }
}
