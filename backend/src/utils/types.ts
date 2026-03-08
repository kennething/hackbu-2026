import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, CallbackFn } from "./events";
import { Server, type Socket } from "socket.io";
import { getRandomItem } from "./functions";
import { UUID, randomUUID } from "crypto";
import { matches } from "./data";
import fs from "fs";

export type ServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/** current split of the match */
enum MatchSplit {
  /** 1-3 letter words */
  Easy,
  /** 4-6 letter words */
  Medium,
  /** 7+ letter words */
  Hard
}

const wordList = fs.readFileSync("src/utils/words.txt", "utf-8").split(/\r?\n/).filter(Boolean);

/** Represents a match */
export class Match {
  /** UUID for the match */
  uuid: UUID;
  /** main socket UUIDs of players
   *
   * `currentWord` = `-1` if the player hasnt confirmed the match, 0 otherwise
   */
  players: [playerUuid: UUID, currentWord: number, confirmMatch: CallbackFn | null][];
  /** current split of the match */
  currentSplit = MatchSplit.Easy;
  /** time remaining on the current split */
  timeRemaining = 20;
  /** list of words for the current split */
  currentWords: string[];

  private interval?: NodeJS.Timeout;
  private onAdvanceSplit: (newSplit: MatchSplit, newWord: string) => void;
  private onEndGame: () => void;

  constructor(playerUuids: SocketType[], onAdvanceSplit: (newSplit: MatchSplit, newWord: string) => void, onEndGame: () => void) {
    this.uuid = randomUUID();
    this.players = playerUuids.map((socket) => [socket.data.uuid!, -1, null]);
    this.onAdvanceSplit = onAdvanceSplit;
    this.onEndGame = onEndGame;

    const words = new Set<string>();
    for (let i = 0; i < 20; i++) words.add(getRandomItem(wordList.filter((word) => word.length <= 3)));
    this.currentWords = Array.from(words);

    playerUuids.forEach((socket) => (socket.data.matchUuid = this.uuid));
    matches.set(this.uuid, this);
  }

  /** sets a player's callback function for match confirmation, and runs the callbacks of all players if all players are ready
   *
   * also starts the game after 3 seconds
   */
  setCallback(playerUuid: UUID, callback: CallbackFn): void {
    const player = this.players.find(([uuid]) => uuid === playerUuid);
    if (!player) return;

    player[2] = callback;
    player[1] = 0;

    if (this.players.some(([, currentWord]) => currentWord !== -1)) return;

    this.players.forEach(([_, __, callback]) => callback?.(true, this.currentWords[0]));
    setInterval(this.startMatch, 3000);
  }

  /** validates a word, and returns the next word if correct
   * @param image image to validate
   * @param playerUuid player to validate for
   * @returns `[isCorrect, nextWord]` where isCorrect is whether the submitted word is correct, and nextWord is the next word to submit if the submitted word is correct
   */
  submitWord(image: ArrayBuffer, playerUuid: UUID): [isCorrect: boolean, nextWord: string | null] {
    // TODO: validate word
    const isCorrect = true;
    if (!isCorrect) return [false, null];

    const player = this.players.find(([uuid]) => uuid === playerUuid);
    if (!player) return [false, null];

    if (isCorrect) player[1]++;
    if (player[1] >= this.currentWords.length - 3) for (let i = 0; i < 10; i++) this.currentWords.push(getRandomItem(wordList.filter((word) => word.length <= 3 + this.currentSplit * 2)));

    return [true, this.currentWords[player[1]]];
  }

  /** starts the match */
  private startMatch(): void {
    this.interval = setInterval(() => {
      if (this.timeRemaining === 0) return this.advanceSplit();
      this.timeRemaining--;
    }, 1000);
  }

  private advanceSplit(): void {
    if (this.currentSplit === MatchSplit.Hard) return this.endMatch();
    this.currentSplit++;
    this.timeRemaining = 20 + this.currentSplit * 10; // ? 30s for medium, 40s for hard
    this.onAdvanceSplit(this.currentSplit, this.currentWords[0]);
  }

  private endMatch(): void {
    if (!this.interval) return;
    clearInterval(this.interval);
    matches.delete(this.uuid);
    this.onEndGame();
  }
}
