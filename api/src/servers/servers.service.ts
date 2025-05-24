import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Server, ServerDocument } from './schemas/server.schema';
import { Model } from 'mongoose';
import { Channel, ChannelDocument } from '../channels/schema/channel.schema';
import { UsersService } from 'src/users/users.service';
import { Types } from 'mongoose';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(name: string, userId: string): Promise<Server> {
    const server = new this.serverModel({
      name,
      creator: userId,
      members: [userId],
      channels: [],
    });

    await server.save();

    const defaultChannel = new this.channelModel({
      name: 'general',
      server: server._id,
    });

    await defaultChannel.save();

    server.channels.push(defaultChannel._id as any);
    await server.save();

    return server;
  }

  async findByUser(userId: string): Promise<Server[]> {
    return this.serverModel.find({ members: userId });
  }

  async joinServer(serverId: string, userId: string): Promise<Server | null> {
    return this.serverModel.findByIdAndUpdate(
      serverId,
      { $addToSet: { members: userId } },
      { new: true },
    );
  }

  async addMemberByEmail(serverId: string, email: string, requesterId: string) {
    const server = await this.serverModel.findById(serverId);
    if (!server) throw new NotFoundException('Servidor no encontrado');

    if (server.creator.toString() !== requesterId) {
      throw new ForbiddenException('Solo el creador puede agregar usuarios');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user || !user._id)
      throw new NotFoundException('Usuario no encontrado');

    const alreadyMember = server.members.find(
      (id) => id.toString() === user._id!.toString(),
    );

    if (alreadyMember) {
      throw new ForbiddenException('Usuario ya es miembro del servidor');
    }

    server.members.push(new Types.ObjectId(user._id));
    await server.save();

    // ✅ Retorna también el usuario
    return {
      message: 'Usuario agregado correctamente',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getMembers(serverId: string, userId: string) {
    const server = await this.serverModel
      .findById(serverId)
      .populate('members', 'name email _id');

    if (!server) throw new NotFoundException('Servidor no encontrado');

    const isMember = server.members.some(
      (member: any) => member._id.toString() === userId.toString(),
    );

    if (!isMember) throw new ForbiddenException('No eres miembro del servidor');

    return server.members;
  }
}
