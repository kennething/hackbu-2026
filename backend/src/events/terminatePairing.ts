import { ServerType, SocketType } from "../utils/types";
import { rooms } from "../utils/data";

export function terminatePairing(io: ServerType, socket: SocketType): void {
  const uuid = socket.data.uuid ?? socket.data.pairUuid;
  if (!uuid) return;

  rooms.delete(uuid);
  io.to(uuid).emit("terminatePairing");
}
