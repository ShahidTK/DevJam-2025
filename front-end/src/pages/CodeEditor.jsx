import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Editor } from "@monaco-editor/react";

const socket = io("http://localhost:8000"); // Update with your server URL

const CodeEditor = () => {
  const [code, setCode] = useState("// Start coding here...");

  useEffect(() => {
    // Listen for code updates from other users
    socket.on("codeChange", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("codeChange");
    };
  }, []);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socket.emit("codeChange", newValue);
  };

  return (
    <div className="h-screen p-4">
      <h2 className="text-xl font-bold mb-2">Live Code Editor</h2>
      <Editor
        height="80vh"
        theme="vs-dark"
        defaultLanguage="javascript"
        value={code}
        onChange={handleCodeChange}
      />
    </div>
  );
};

export default CodeEditor;
