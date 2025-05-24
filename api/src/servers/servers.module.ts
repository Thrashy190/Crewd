import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Server, ServerSchema } from './schemas/server.schema';
import { Channel, ChannelSchema } from '../channels/schema/channel.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { UsersModule } from '../users/users.module'; // ✅ importa módulo

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Server.name, schema: ServerSchema },
      { name: Channel.name, schema: ChannelSchema },
    ]),
    UsersModule, // ✅ Importa aquí
  ],
  controllers: [ServersController],
  providers: [ServersService],
})
export class ServersModule {}
