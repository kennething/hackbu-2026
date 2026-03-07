import { ServerType, SocketType } from "../utils/types";
import { CallbackFn } from "../utils/events";
import { UUID } from "crypto";

export function pair(io: ServerType, socket: SocketType, code: UUID, callback: CallbackFn): void {
  if (socket.data.pairUuid) return;

  socket.data.pairUuid = code;
  io.to(code).emit("pairingSuccess");
  socket.join(code);

  callback(true);
}
