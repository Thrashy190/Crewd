import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServersModule } from './servers/servers.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { GatewayModule } from './gateway/gateway.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/discord-clone'),
    AuthModule,
    UsersModule,
    ServersModule,
    ChannelsModule,
    MessagesModule,
    GatewayModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
