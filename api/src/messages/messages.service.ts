import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { Channel, ChannelDocument } from '../channels/schema/channel.schema';
import { Server, ServerDocument } from '../servers/schemas/server.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
  ) {}

  async create(
    channelId: string,
    userId: string,
    content: string,
  ): Promise<Message> {
    const channel = await this.channelModel
      .findById(channelId)
      .populate<{ server: ServerDocument }>('server');
    if (!channel || !channel.server)
      throw new NotFoundException('Canal o servidor no encontrado');

    const server = await this.serverModel.findById(channel.server._id);
    if (!server || !server.members.some((id) => id.toString() === userId)) {
      throw new ForbiddenException('No eres miembro del servidor');
    }

    const message = new this.messageModel({
      channel: channelId,
      sender: userId,
      content,
    });
    return message.save();
  }

  async findByChannel(channelId: string, userId: string): Promise<Message[]> {
    const channel = await this.channelModel
      .findById(channelId)
      .populate<{ server: ServerDocument }>('server');
    if (!channel || !channel.server)
      throw new NotFoundException('Canal o servidor no encontrado');

    const server = await this.serverModel.findById(channel.server._id);
    if (!server || !server.members.some((id) => id.toString() === userId)) {
      throw new ForbiddenException('Acceso denegado');
    }

    return this.messageModel.find({ channel: channelId }).populate('sender');
  }
}
