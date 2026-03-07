import { Room, SocketType } from "../utils/types";
import { CallbackFn } from "../utils/events";
import { randomUUID, UUID } from "crypto";
import { rooms } from "../utils/data";

export function connectMainSocket(socket: SocketType, callback: CallbackFn<UUID>): void {
  const uuid = randomUUID();

  socket.data.uuid = uuid;
  socket.join(uuid);
  rooms.set(uuid, new Room(uuid));

  callback(true, uuid);
}
