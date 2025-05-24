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
  create(@Body() body: { name: string }, @Req() req: any) {
    return this.serversService.create(body.name, req.user._id);
  }

  @Get('my')
  myServers(@Req() req: any) {
    return this.serversService.findByUser(req.user._id);
  }

  @Post(':serverId/join')
  joinServer(@Param('serverId') serverId: string, @Req() req: any) {
    return this.serversService.joinServer(serverId, req.user._id);
  }

  @Post(':serverId/add-member')
  async addMember(
    @Param('serverId') serverId: string,
    @Body('email') email: string,
    @Req() req: any,
  ) {
    return this.serversService.addMemberByEmail(serverId, email, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':serverId/members')
  async getMembers(@Param('serverId') serverId: string, @Req() req: any) {
    return this.serversService.getMembers(serverId, req.user._id);
  }
}
