import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./utils/events";
import express, { Router } from "express";
import { createServer } from "https";
import { Server } from "socket.io";
import * as events from "./events";
import { UUID } from "crypto";
import cors from "cors";
import path from "path";
import "dotenv/config";
import fs from "fs";
import { queue } from "./utils/data";
import { Match } from "./utils/types";

const app = express();
app.use(cors()).use(express.json());

const projectRoot = process.cwd();
const routesDir = path.join(projectRoot, "src", "routes");
fs.readdirSync(routesDir).forEach(async (file) => {
  if (!file.endsWith(".ts")) return;

  const routePath = path.join(routesDir, file);
  const router = (await import(routePath)).default as Router;
  app.use("/", router);
});

const server = createServer({ key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") }, app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, { cors: {} });

io.on("connection", (socket) => {
  socket.on("pollFrame", (blob) => events.pollFrame(socket, blob as unknown as ArrayBuffer));

  socket.on("connectMainSocket", (callback) => events.connectMainSocket(socket, callback));
  socket.on("pair", (code, callback) => events.pair(io, socket, code as UUID, callback));
  socket.timeout(99_999_999).on("confirmPair", (callback) => socket.to(socket.data.uuid!).emit("pairingConfirmed", () => callback(true)));
  socket.on("terminatePairing", () => events.terminatePairing(io, socket));

  socket.timeout(99_999_999).on("joinQueue", (callback) => queue.push({ socket, callback }));
  socket.timeout(99_999_999).on("confirmMatch", (callback) => events.confirmMatch(io, socket, callback));
});

setInterval(() => {
  if (queue.length < 2) return;
  const player1 = queue.shift()!;
  const player1Uuid = player1.socket.data.uuid!;
  const player2 = queue.shift()!;
  const player2Uuid = player2.socket.data.uuid!;

  new Match(
    [player1.socket, player2.socket],
    (newSplit, newWord) => io.to(player1Uuid).to(player2Uuid).emit("advanceSplit", newSplit, newWord),
    () => io.to(player1Uuid).to(player2Uuid).emit("endGame")
  );

  player1.callback(true);
  player2.callback(true);
}, 1000);

const port = Number(process.env.PORT) || 8008;
server.listen(port, "0.0.0.0", () => console.log(`Server is up on port ${port}`));
