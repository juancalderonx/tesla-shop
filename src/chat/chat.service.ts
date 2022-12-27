import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ConnectedClients } from './interfaces/connected-client.interface';

@Injectable()
export class ChatService {

  private connectedClients: ConnectedClients = {}

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async registerClient(client: Socket, userId: string) {

    const user = await this.userRepository.findOneBy({id: userId});

    if(!user) throw new Error(`User not found`);

    if(user.status === "inactive" || user.status === "erased") throw new Error(`User is inactive or has been deleted`);

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
    }
  }

  removeClient( idClient: string ) {
    delete this.connectedClients[idClient];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullname(socketId: string) {
    return this.connectedClients[socketId].user.fullname;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if(connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }

    }
  }

}
