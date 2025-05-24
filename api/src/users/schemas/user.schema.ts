import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Server } from 'src/servers/schemas/server.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  avatarUrl: string;

  @Prop({ required: true })
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }])
  servers: Server[];
}

export const UserSchema = SchemaFactory.createForClass(User);
