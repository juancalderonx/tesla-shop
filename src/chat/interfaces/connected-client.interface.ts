import { Socket } from "socket.io";

export interface ConnectedClients {
  [id: string]: Socket
}