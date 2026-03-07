import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./events";
import { Server, type Socket } from "socket.io";
import { UUID } from "crypto";

export type ServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/** Represents a game room */
export class Room {
  /** UUID for the room */
  uuid: UUID;

  constructor(uuid: UUID) {
    this.uuid = uuid;
  }
}
