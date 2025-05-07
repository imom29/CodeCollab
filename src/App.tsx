import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";

// Page for creating or entering a room
function Home() {
  const navigate = useNavigate();
  const createRoom = useCallback(() => {
    const roomId = Math.random().toString(36).slice(2, 10); // random short id
    navigate(`/room/${roomId}`);
  }, [navigate]);
  return (
    <div style={{ padding: 32 }}>
      <h1>📝 Collaborative Code Editor</h1>
      <button onClick={createRoom} style={{ fontSize: 18, padding: 12 }}>
        Create Room
      </button>
      <p>Or share the room link to edit together in real-time.</p>
    </div>
  );
}

const SERVER_URL = "http://localhost:4000";
interface FileObject {
  fileName: string;
  code: string;
  language: string;
}
function Room() {
  const { roomId } = useParams();
  const socketRef = useRef<Socket>();
  const ignoringIncoming = useRef(false); // For change loop prevention
  const [files, setFiles] = useState<FileObject[]>([]);
  const [activeFile, setActiveFile] = useState<FileObject | null>(null);
  const [language, setLanguage] = useState<string>("");
  // Initiate socket, join room, and handle code syncing
  useEffect(() => {
    if (!roomId) return;
    // Connect
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.emit("join-room", roomId);


     // Receive initial files
     socket.on("init-files", (roomFiles: FileObject[]) => {
      setFiles(roomFiles);
      if (roomFiles.length > 0) {
        setActiveFile(roomFiles[0]);
      }
    });

    // Receive remote code changes
    socket.on("remote-code-change", ({ fileName, newCode }: { fileName: string; newCode: string }) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.fileName === fileName ? { ...file, code: newCode } : file
        )
      );
      if (activeFile?.fileName === fileName) {
        ignoringIncoming.current = true;
        setActiveFile((prev) => prev ? { ...prev, code: newCode } : null);
      }
    });

    // Receive remote language change
    socket.on("remote-language-change", ({ fileName, newLanguage }: { fileName: string; newLanguage: string }) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.fileName === fileName ? { ...file, language: newLanguage } : file
        )
      );
      if (activeFile?.fileName === fileName) {
        setActiveFile((prev) => prev ? { ...prev, language: newLanguage } : null);
      }
    });

    // Handle file created
    socket.on("file-created", ({ fileName }: { fileName: string }) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        { fileName, code: "// New file", language: "javascript" },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleEditorChange = (value?: string) => {
    if (!activeFile) return;

    if (ignoringIncoming.current) {
      ignoringIncoming.current = false;
      return;
    }

    const newCode = value || "";

    setActiveFile((prev) => prev ? { ...prev, code: newCode } : null);
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.fileName === activeFile.fileName ? { ...file, code: newCode } : file
      )
    );

    socketRef.current?.emit("code-change", {
      roomId,
      fileName: activeFile.fileName,
      newCode,
    });
  };

  const handleFileSwitch = (fileName: string) => {
    const file = files.find(f => f.fileName === fileName);
    if (file) {
      setActiveFile(file);
    }
    console.log(file)
    setLanguage(file?.language || "");
  };
  
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#222", color: "#fff", padding: 12 }}>
        Room: <b>{roomId}</b>
        <span style={{ marginLeft: 20, fontSize: 14 }}>
          Share this link to collaborate: {window.location.href}
        </span>
        {language}
      </div>

      <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", background: "#1e1e1e", color: "white", padding: "10px" }}>
        <h3>Files</h3>

      {/* New File Button */}
      <button
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginBottom: "10px",
          cursor: "pointer",
        }}
        onClick={() => {
          const fileName = prompt("Enter new file name (e.g., newFile.js)");
          if (!fileName) return;
          
          socketRef.current?.emit("create-file", { roomId, fileName });
        }}
      >
        + New File
      </button>

        {files.map((file) => (
          <div
            key={file.fileName}
            onClick={() => handleFileSwitch(file.fileName)}
            style={{
              padding: "8px",
              background: activeFile?.fileName === file.fileName ? "#333" : "transparent",
              cursor: "pointer",
              borderRadius: "4px",
              marginBottom: "4px",
            }}
          >
            {file.fileName}
          </div>
        ))}
      </div>

      {/* Monaco Editor */}
      <div style={{ flex: 1 }}>
        {activeFile && (
          <>
            {/* Pass activeFile.code and activeFile.language to your Monaco Editor */}
            {/* Example: */}
            <MonacoEditor value={activeFile.code} language={activeFile.language} onChange={handleEditorChange} theme="vs-dark" options={{ fontSize: 16, minimap: { enabled: false } }} />
          </>
        )}
      </div>
    </div>

    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
}
