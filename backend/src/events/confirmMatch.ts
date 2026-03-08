import { ServerType, SocketType } from "../utils/types";
import { CallbackFn } from "../utils/events";
import { matches } from "../utils/data";

export function confirmMatch(io: ServerType, socket: SocketType, callback: CallbackFn): void {
  const matchUuid = socket.data.matchUuid;
  if (!matchUuid) return callback(false);

  const match = matches.get(matchUuid);
  if (!match) return callback(false);

  match.setCallback(socket.data.uuid!, callback);
}
