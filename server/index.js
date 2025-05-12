import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { findLanguage } from "./utils.js";
import { DEFAULT_CODE } from "./constants.js";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // adjust for prod
    methods: ["GET", "POST"],
  },
});

// In-memory map: roomId -> {
// fileName: string,
// code: string,
// language: string
// }[]
const rooms = {};

io.on("connection", (socket) => {
  // Join a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    // Initialize room if needed
    if (!rooms[roomId]) {
      rooms[roomId] = [
        {
          fileName: "index.js",
          code: DEFAULT_CODE["javascript"],
          language: "javascript",
        },
      ];
    }

    // Send current files to the joining socket
    socket.emit("init-files", rooms[roomId]);
  });

  // Handle code edits
  socket.on("code-change", ({ roomId, fileName, newCode }) => {
    const roomFiles = rooms[roomId];
    if (!roomFiles) return;

    const file = roomFiles.find((f) => f.fileName === fileName);
    if (!file) return;

    file.code = newCode;

    // Broadcast to others
    socket.to(roomId).emit("remote-code-change", { fileName, newCode });
  });

  // Create new file
  socket.on("create-file", ({ roomId, fileName }) => {
    if (!rooms[roomId]) return;

    const language = findLanguage(fileName);

    rooms[roomId].push({
      fileName: fileName,
      code: DEFAULT_CODE[language.toLowerCase()],
      language: language || "javascript",
    });

    socket.to(roomId).emit("file-created", { fileName });
    // You might want to emit to the sender too
    socket.emit("file-created", { fileName });
  });

  socket.on("delete-file", ({ roomId, fileName }) => {
    if (!rooms[roomId]) return;
    const fileIndex = rooms[roomId].findIndex((element) => {
      if (element.fileName === fileName) {
        return element;
      }
    });
    rooms[roomId].splice(fileIndex, 1);
    const roomFiles = rooms[roomId];
    socket.to(roomId).emit("file-deleted", { roomFiles });
    socket.emit("file-deleted", { roomFiles });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
