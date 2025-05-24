import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('servers')
@UseGuards(JwtAuthGuard)
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  create(@Body() dto: any, @Req() req: any) {
    return this.serversService.create(dto, req.user._id);
  }

  @Get('my')
  myServers(@Req() req: any) {
    return this.serversService.findByUser(req.user._id);
  }

  @Post(':serverId/join')
  joinServer(@Param('serverId') serverId: string, @Req() req: any) {
    return this.serversService.joinServer(serverId, req.user._id);
  }
}
