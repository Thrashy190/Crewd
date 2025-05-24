import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post(':channelId')
  create(
    @Param('channelId') channelId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    return this.messagesService.create(channelId, req.user._id, content);
  }
  @Get(':channelId')
  findAll(@Param('channelId') channelId: string, @Req() req: any) {
    return this.messagesService.findByChannel(channelId, req.user._id);
  }
}
