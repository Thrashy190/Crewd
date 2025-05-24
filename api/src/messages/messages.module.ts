import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Channel, ChannelSchema } from '../channels/schema/channel.schema';
import { Server, ServerSchema } from '../servers/schemas/server.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: Server.name, schema: ServerSchema },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
