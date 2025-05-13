import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot, User, Clipboard, OctagonPauseIcon } from "lucide-react"; // Icon imports

type ChatBotProps = {
    code: string,
    language: string
}

export default function ChatbotPanel(activeFile: ChatBotProps) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{
    text: string,
    sender: string
  }[]>([]);
  const [opacity, setOpacity] = useState(0.8)

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setOpacity(0.4)

    try {
      const res = await axios.post("http://localhost:4000/suggest", {
        code: activeFile?.code || "",
        question: chatInput,
        language: activeFile?.language || "javascript",
      });

      console.log(res)

      const aiMsg = { sender: "ai", text: res.data.answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Error: Unable to fetch response." }]);
    }
  };

  const CopyButton = ({ code }: { code: string }) => (
    <button
      className="absolute top-1 right-1 p-1 text-xs text-zinc-300 hover:text-white"
      onClick={() => navigator.clipboard.writeText(code)}
      title="Copy code"
    >
      <Clipboard className="w-4 h-4" />
    </button>
  );

  return (
    <div className="relative flex flex-col h-full bg-zinc-900/70 border-l border-zinc-800 text-white bg-brand-blue">
      <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: "url('/src/assets/chat-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: `${opacity}`, // Adjust as needed
      }}
    ></div>
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "ai" && <Bot className="w-4 h-4 mt-1 text-zinc-400" />}
            {msg.sender === "user" && <User className="w-4 h-4 mt-1 text-blue-400" />}
            <div
              className={`p-2 rounded-md max-w-[80%] whitespace-pre-wrap text-sm relative ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-100"
              }`}
            >
              {msg.sender === "ai" ? (
                <ReactMarkdown
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeStr = String(children).replace(/\n$/, "");
                      return !inline && match ? (
                        <div className="relative">
                          <CopyButton code={codeStr} />
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {codeStr}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="z-10 p-2 border-t border-zinc-700 bg-zinc-800 flex gap-2">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border border-zinc-600 rounded-md text-sm bg-zinc-700 text-white placeholder-zinc-400"
          placeholder="Ask about your code..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-700 text-white px-4 rounded-md text-sm hover:bg-blue-800"
        >
          Send
        </button>
      </div>
    </div>
  );
}
