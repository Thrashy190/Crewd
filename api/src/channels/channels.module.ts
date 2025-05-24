import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './schema/channel.schema';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { Server, ServerSchema } from '../servers/schemas/server.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Channel.name, schema: ChannelSchema },
      { name: Server.name, schema: ServerSchema },
    ]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
