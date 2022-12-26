import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly chatService: ChatService
  ) {}

  handleConnection(client: any ) {
    this.chatService.registerClient(client);
    this.wss.emit('clients-updated', this.chatService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.chatService.removeClient(client.id);
    this.wss.emit('clients-updated', this.chatService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);
  }


}
