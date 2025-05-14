import { Routes, Route, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import { CircularProgress, Tab } from "@mui/material";
import {
  DEFAULT_CODE,
  findExtension,
  findLanguage,
  LANGUAGE_VERSIONS,
} from "./contants";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import axios from "axios";
import ChatbotPanel from "./Chatbot/ChatBot";
import { FilePlus2 } from "lucide-react";
import Header from "./components/Header"
import HomePage from "./Home";

// Page for creating or entering a room
function Home() {
  return (
    <HomePage />
  );
}

const SERVER_URL = "http://localhost:4000";

function Room() {
  const { roomId } = useParams();
  const socketRef = useRef<Socket>();
  const ignoringIncoming = useRef(false); // For change loop prevention
  const [files, setFiles] = useState<FileObject[]>([]);
  const [activeFile, setActiveFile] = useState<FileObject | null>(null);
  const [language, setLanguage] = useState<string>("");
  const [output, setOutput] = useState<string | undefined>();
  const [codeExecuting, setCodeExecuting] = useState<boolean>(false); // Initiate socket, join room, and handle code syncing

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
    socket.on(
      "remote-code-change",
      ({ fileName, newCode }: { fileName: string; newCode: string }) => {
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.fileName === fileName ? { ...file, code: newCode } : file
          )
        );
        if (activeFile?.fileName === fileName) {
          ignoringIncoming.current = true;
          setActiveFile((prev) => (prev ? { ...prev, code: newCode } : null));
        }
      }
    );

    // Receive remote language change
    socket.on(
      "remote-language-change",
      ({
        fileName,
        newLanguage,
      }: {
        fileName: string;
        newLanguage: string;
      }) => {
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.fileName === fileName
              ? { ...file, language: newLanguage }
              : file
          )
        );
        if (activeFile?.fileName === fileName) {
          setActiveFile((prev) =>
            prev ? { ...prev, language: newLanguage } : null
          );
        }
      }
    );

    // Handle file created
    socket.on("file-created", ({ fileName }: { fileName: string }) => {
      const language = findLanguage(fileName.split(".")[1]);
      console.log(language);
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          fileName,
          code: DEFAULT_CODE[
            language.toLowerCase() as keyof typeof DEFAULT_CODE
          ],
          language: language,
        },
      ]);

      setActiveFile({
        fileName,
        code: DEFAULT_CODE[language.toLowerCase() as keyof typeof DEFAULT_CODE],
        language: language,
      });
    });

    socket.on("file-deleted", ({ roomFiles }) => {
      setFiles([...roomFiles]);
      setActiveFile(roomFiles[0]);
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

    setActiveFile((prev) => (prev ? { ...prev, code: newCode } : null));
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.fileName === activeFile.fileName
          ? { ...file, code: newCode }
          : file
      )
    );

    socketRef.current?.emit("code-change", {
      roomId,
      fileName: activeFile.fileName,
      newCode,
    });
  };

  const executeCode = (
    code: string | undefined,
    language: keyof typeof LANGUAGE_VERSIONS
  ) => {
    const langKey = language.toLowerCase() as keyof typeof LANGUAGE_VERSIONS;
    const version = LANGUAGE_VERSIONS[langKey];

    const ext = findExtension(language.toLowerCase());
    const result = axios
      .post("https://emkc.org/api/v2/piston/execute", {
        language: ext,
        version: version,
        files: [{ content: code }],
      })
      .then((res) => {
        setOutput(res.data.run.output);
        setCodeExecuting(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (event: React.SyntheticEvent, fileName: string) => {
    const file = files.find((f) => f.fileName === fileName);
    if (file) {
      setActiveFile(file);
    }
    console.log(file);
    setLanguage(file?.language || "");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }} className="bg-brand">
      <Header roomId={roomId} files={files} />
      <div style={{ display: "flex", height: "90vh" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "200px",
            background: "#1e1e1e",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            margin: "5px",
            flex: 0.5,
          }}
        >

          {/* New File Button */}
          <button
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#0899dd",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginBottom: "10px",
              cursor: "pointer",
              display: "flex",
              gap: "1rem"
            }}
            onClick={() => {
              const fileName = prompt("Enter new file name (e.g., newFile.js)");
              if (!fileName) return;
              if (files.find((file) => file.fileName === fileName)) {
                alert("File with this name already exists!!");
                return;
              }

              socketRef.current?.emit("create-file", { roomId, fileName });
            }}
          >
           <FilePlus2 /> Add File
          </button>

          <h3>Files</h3>

          {files.map((file) => (
            <div
              key={file.fileName}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px",
                background:
                  activeFile?.fileName === file.fileName
                    ? "#333"
                    : "transparent",
                borderRadius: "4px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <InsertDriveFileOutlinedIcon
                  sx={{ marginRight: "5px", color: "#0899dd" }}
                />
                {file.fileName}
              </div>
              <div>
                <DeleteOutlineIcon
                  fontSize="small"
                  style={{
                    color: "#0899dd",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const res = confirm(
                      "Are you sure you want to delete this file?"
                    );
                    if (!res) return;
                    const fileName = file.fileName;

                    socketRef.current?.emit("delete-file", {
                      roomId,
                      fileName,
                    });
                  }}
                >
                  Delete file
                </DeleteOutlineIcon>
              </div>
            </div>
          ))}
        </div>

        {/* Monaco Editor */}
        <div
          style={{
            flex: 2,
            borderRadius: "10px",
            margin: "5px",
            width: "50vw",
            backgroundColor: "rgb(30,30,30)",
          }}
        >
          <TabContext value={activeFile ? activeFile.fileName : ""}>
            <TabList onChange={handleChange}>
              {files.map((file, index) => (
                <Tab
                  key={index}
                  label={file.fileName}
                  value={file.fileName}
                  sx={{
                    color: "white",
                    textTransform: "lowercase",
                  }}
                />
              ))}
            </TabList>
            <button
              style={{
                position: "relative",
                top: "-50px",
                left: "89%",
                backgroundColor: "#0899dd",
                width: "10%",
                padding: "8px",
                color: "white",
                border: "none",
                borderRadius: "4px",
                marginBottom: "10px",
                marginTop: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (activeFile?.language) {
                  setCodeExecuting(true);
                  executeCode(
                    activeFile.code,
                    activeFile.language as keyof typeof LANGUAGE_VERSIONS
                  );
                } else {
                  console.error("Language is undefined");
                }
              }}
            >
              Run code
            </button>
            <TabPanel
              value={activeFile ? activeFile?.fileName : ""}
              sx={{
                margin: 0,
                height: "90%",
                padding: 0,
                marginTop: "-50px",
              }}
            >
              {activeFile && (
                <MonacoEditor
                  value={activeFile?.code}
                  language={activeFile?.language}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{ fontSize: 16, minimap: { enabled: false } }}
                />
              )}
            </TabPanel>
          </TabContext>
        </div>
        <div style={{ flex: 1 }}>
          <ChatbotPanel
            code={activeFile?.code || ""}
            language={activeFile?.language || ""}
          />
        </div>
      </div>
      <div>
        <div
          style={{
            height: "25vh",
            background: "#1e1e1e",
            borderRadius: "10px",
            margin: "5px",
          }}
        >
          <div
            style={{
              borderBottom: "0.5px solid #0899dd",
              padding: "15px",
              fontWeight: "bold",
              color: "#0899dd"
            }}
          >
            Console
          </div>
          {codeExecuting && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <CircularProgress size="20px" />
            </div>
          )}
          {!codeExecuting &&
            output &&
            output
              .split("\n")
              .map((op: string) => (
                <div style={{ padding: "0 15px 0 15px", color: "#0899dd" }}>{op}</div>
              ))}
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
