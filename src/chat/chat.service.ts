import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedClients } from './interfaces/connected-client.interface';

@Injectable()
export class ChatService {

  private connectedClients: ConnectedClients = {}

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  removeClient( idClient: string ) {
    delete this.connectedClients[idClient];
  }

  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }

}
