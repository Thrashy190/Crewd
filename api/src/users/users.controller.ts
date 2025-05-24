import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    return this.usersService.findById(req.user._id);
  }

  @Patch('me')
  async updateMe(@Req() req: any, @Body() body: { name?: string; username?: string }) {
    return this.usersService.updateUser(req.user._id, body);
  }
}
