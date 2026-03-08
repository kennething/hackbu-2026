import { Match, SocketType } from "./types";
import { CallbackFn } from "./events";
import { UUID } from "crypto";

/** Map between matchUuid and Match */
export const matches = new Map<UUID, Match>();

/** Queue of callback functions of all currently queued users */
export const queue: { socket: SocketType; callback: CallbackFn }[] = [];
