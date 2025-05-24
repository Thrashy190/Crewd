import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post(':serverId')
  create(@Param('serverId') serverId: string, @Body() dto: any, @Req() req: any) {
    return this.channelsService.create(dto.name, serverId, req.user._id);
  }

  @Get(':serverId')
  findAll(@Param('serverId') serverId: string, @Req() req: any) {
    return this.channelsService.findByServer(serverId, req.user._id);
  }
}