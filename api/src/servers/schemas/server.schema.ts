import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Channel } from 'src/channels/schema/channel.schema';

export type ServerDocument = Server & Document;

@Schema({ timestamps: true })
export class Server {
  @Prop({ required: true })
  name: string;

  @Prop()
  logoUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  members: User[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }])
  channels: Channel[];
}

export const ServerSchema = SchemaFactory.createForClass(Server);
