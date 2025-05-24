import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './schema/channel.schema';
import { Server, ServerDocument } from '../servers/schemas/server.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
  ) {}

  async create(
    name: string,
    serverId: string,
    userId: string,
  ): Promise<Channel> {
    const server = await this.serverModel.findById(serverId);
    if (!server) throw new NotFoundException('Servidor no encontrado');
    if (!server.members.map((id) => id.toString()).includes(userId))
      throw new ForbiddenException('No eres miembro de este servidor');

    const channel = new this.channelModel({ name, server: serverId });
    await channel.save();
    server.channels.push(channel._id as any);
    await server.save();
    return channel;
  }

  async findByServer(serverId: string, userId: string): Promise<Channel[]> {
    const server = await this.serverModel.findById(serverId);
    if (!server) throw new NotFoundException('Servidor no encontrado');
    if (!server.members.map((id) => id.toString()).includes(userId))
      throw new ForbiddenException('Acceso denegado');
    return this.channelModel.find({ server: serverId });
  }
}
