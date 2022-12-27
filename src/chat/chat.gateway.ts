import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket ) {

    const token = client.handshake.headers.auth as string;

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.chatService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.chatService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.chatService.removeClient(client.id);
    this.wss.emit('clients-updated', this.chatService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    
    // Emite únicamente al cliente, no a todos.
    // client.emit('message-from-server', {
    //   fullname: 'Me',
    //   message: payload.message || 'No message available'
    // });

    // Emitir a todos menos al cliente inicial.
    // client.broadcast.emit('message-from-server', {
    //   fullname: 'Me',
    //   message: payload.message || 'No message available'
    // });

    // Emitir a TODOS los clientes conectados.
    this.wss.emit('message-from-server', {
      fullname: this.chatService.getUserFullname(client.id),
      message: payload.message || 'No message available'
    });

  }


}
