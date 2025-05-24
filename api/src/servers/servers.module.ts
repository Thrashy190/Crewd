import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Server, ServerSchema } from './schemas/server.schema';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
  ],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService], // si otro módulo lo necesita
})
export class ServersModule {}
