import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import axios from "axios";

const socket = io("http://localhost:8000");

const CodeEditor = () => {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userList", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("userList");
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeUpdate", newCode);
  };

  const handleCompile = async () => {
    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        source: code,
      });
      setOutput(response.data.run.stdout || response.data.run.stderr);
    } catch (error) {
      setOutput("Compilation Error");
    }
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-2">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button onClick={handleCompile} className="p-2 bg-blue-500 text-white rounded">Run Code</button>
      </div>

      <div className="flex flex-1">
        <div className="w-3/4 border">
          <Editor
            height="80vh"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={handleCodeChange}
          />
        </div>
        <div className="w-1/4 p-2 border-l">
          <h3 className="font-bold">Users Online:</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index} className="text-green-500">{user}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-2 p-2 border bg-gray-100">
        <h3 className="font-bold">Output:</h3>
        <pre className="bg-black text-white p-2">{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
