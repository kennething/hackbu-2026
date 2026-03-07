import { SocketType } from "../utils/types";

export function pollFrame(socket: SocketType, blob: ArrayBuffer): void {
  if (!socket.data.pairUuid) return;

  socket.to(socket.data.pairUuid).emit("getFrame", blob);
}
