import { SocketType } from "../utils/types";
import { CallbackFn } from "../utils/events";
import { randomUUID, UUID } from "crypto";

export function connectMainSocket(socket: SocketType, callback: CallbackFn<UUID>): void {
  const uuid = randomUUID();

  socket.data.uuid = uuid;
  socket.join(uuid);

  callback(true, uuid);
}
