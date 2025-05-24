import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdUser = new this.userModel({
      ...dto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async updateUser(id: string, update: Partial<User>): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, update, {
        new: true,
      })
      .select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
}
