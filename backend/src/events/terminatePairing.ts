import { ServerType, SocketType } from "../utils/types";

export function terminatePairing(io: ServerType, socket: SocketType): void {
  const uuid = socket.data.uuid ?? socket.data.pairUuid;
  if (!uuid) return;

  io.to(uuid).emit("terminatePairing");
}
