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

  /** send a word to the main socket */
  getWord: (word: string) => void;
  /** tell main socket to advance to the next split */
  advanceSplit: (newSplit: number, newWord: string) => void;
  /** tell main socket to end the game */
  endGame: () => void;
}

export interface ClientToServerEvents {
  /** send a frame blob from camera socket
   * @param callback whether the frame was successfully processed (whether the word was correct)
   */
  pollFrame: (blob: Blob, callback: CallbackFn) => void;

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

  /** sent by main socket to join the race queue
   * @param callback receive when a match is found
   */
  joinQueue: (callback: CallbackFn) => void;
  /** sent by main socket to confirm player is ready for a match
   * @param callback receive when the game starts, has `newWord` parameter for first word of match
   */
  confirmMatch: (callback: CallbackFn) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  /** only present on main sockets */
  uuid?: UUID;
  /** only present on camera sockets */
  pairUuid?: UUID;

  /** the UUID of the match the socket is in */
  matchUuid?: UUID;
}
