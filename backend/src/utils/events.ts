import { UUID } from "crypto";

export type CallbackFn<T = string> = (success: boolean, data?: T) => void;

export interface ServerToClientEvents {
  /** send a frame blob to main socket */
  getFrame: (blob: ArrayBuffer) => void;
  /** send to camera socket to confirm pair was accepted
   * @param callback acknowledge that the camera is centered
   */
  pairingConfirmed: (callback: CallbackFn) => void;
  /** send back to main socket that pairing was successful */
  pairingSuccess: () => void;
  /** send to both sockets to terminate the pairing */
  terminatePairing: () => void;
}

export interface ClientToServerEvents {
  /** send a frame blob from camera socket */
  pollFrame: (blob: Blob) => void;
  /** sets the socket as a main socket and get a pairing code back
   * @param callback gives pairing code to main socket so it can generate qr code
   */
  connectMainSocket: (callback: CallbackFn<UUID>) => void;
  /** receive from camera socket to pair with a main socket */
  pair: (code: string, callback: CallbackFn) => void;
  /** sent by main socket to confirm camera socket is correct
   * @param callback receive when camera socket confirms its centered
   */
  confirmPair: (callback: CallbackFn) => void;
  /** can be sent by either socket to kill the connection */
  terminatePairing: () => void;
}

export interface InterServerEvents {}

export interface SocketData {
  /** Only present on main sockets */
  uuid?: UUID;
  /** Only present on camera sockets */
  pairUuid?: UUID;
}
