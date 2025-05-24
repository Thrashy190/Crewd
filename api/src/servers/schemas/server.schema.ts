import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Channel } from 'src/channels/schema/channel.schema';

export type ServerDocument = Server & Document;

@Schema({ timestamps: true })
export class Server {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  members: mongoose.Types.ObjectId[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }])
  channels: mongoose.Types.ObjectId[];
}

export const ServerSchema = SchemaFactory.createForClass(Server);
