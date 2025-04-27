import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // adjust for prod
    methods: ["GET", "POST"]
  }
});

// In-memory map: roomId -> {
    // fileName: string,
    // code: string,
    // language: string
// }[]
const rooms = {};

// Default JavaScript template
const defaultCode = `// Welcome to collaborative JS code editor
function hello() {
  console.log('Hello, world!');
}
hello();`;

const findLanguage = (fileName) => {
  const ext = fileName.split(".").pop();
  switch (ext) {
    case "js":
      return "javascript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "html":
      return "html";
    default:
      return "plaintext";
  }
}

io.on("connection", (socket) => {
  // Join a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    // Initialize room if needed
    if (!rooms[roomId]) {
      rooms[roomId] = [
        {
          fileName: "index.js",
          code: defaultCode,
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
    code: defaultCode,
    language: language || "javascript",
  });

  socket.to(roomId).emit("file-created", { fileName });
  // You might want to emit to the sender too
  socket.emit("file-created", { fileName });
});

});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});