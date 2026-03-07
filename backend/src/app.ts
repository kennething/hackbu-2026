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
  socket.on("connectMainSocket", (callback) => events.connectMainSocket(socket, callback));
  socket.on("pair", (code, callback) => events.pair(io, socket, code as UUID, callback));
  socket.on("pollFrame", (blob) => events.pollFrame(socket, blob as unknown as ArrayBuffer));
  socket.timeout(99_999_999).on("confirmPair", (callback) => socket.to(socket.data.uuid!).emit("pairingConfirmed", () => callback(true)));
  socket.on("terminatePairing", () => events.terminatePairing(io, socket));
});

const port = Number(process.env.PORT) || 8008;
server.listen(port, "0.0.0.0", () => console.log(`Server is up on port ${port}`));
