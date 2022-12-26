import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly chatService: ChatService
  ) {}

  handleConnection(client: any ) {
    this.chatService.registerClient(client);
    console.log('Connected clients: ' + this.chatService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.chatService.removeClient(client.id);
    console.log('Connected clients: ' + this.chatService.getConnectedClients());
  }

}
