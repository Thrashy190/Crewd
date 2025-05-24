import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // cámbialo en producción
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Gateway inicializado');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  handleMessage(
    client: Socket,
    payload: { channelId: string; content: string; sender: string },
  ) {
    // Aquí puedes almacenar el mensaje en la DB si quieres, o solo transmitir
    this.server.to(payload.channelId).emit('receive_message', payload);
  }

  @SubscribeMessage('join_channel')
  handleJoinChannel(client: Socket, channelId: string) {
    client.join(channelId);
    console.log(`Cliente ${client.id} se unió al canal ${channelId}`);
  }
}
