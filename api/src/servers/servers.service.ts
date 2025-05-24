import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Server, ServerDocument } from './schemas/server.schema';
import { Model } from 'mongoose';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
  ) {}

  async create(dto: any, userId: string): Promise<Server> {
    const server = new this.serverModel({
      ...dto,
      creator: userId,
      members: [userId],
      channels: [],
    });
    return server.save();
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
}
