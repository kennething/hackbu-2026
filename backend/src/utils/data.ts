import { Room } from "./types";
import { UUID } from "crypto";

/** Map between roomUuid and Room */
export const rooms = new Map<UUID, Room>();
