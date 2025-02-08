import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CodeEditor = () => {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem("userCode");
    if (savedCode) setCode(savedCode);
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem("userCode", newCode);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    const API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
    const languageMap = {
      javascript: 63,
      python: 71,
      cpp: 54,
      java: 62,
    };

    const requestBody = {
      source_code: code,
      language_id: languageMap[language],
      stdin: "",
    };

    const headers = {
      "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    };

    try {
      const { data } = await axios.post(`${API_URL}?base64_encoded=false&wait=true`, requestBody, { headers });
      setOutput(data.stdout || data.stderr || "No output");
    } catch (error) {
      setOutput("Error running code");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">💻 Online Code Editor</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Language:</label>
        <select value={language} onChange={handleLanguageChange} className="border p-2 rounded">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <Editor
        height="400px"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={handleCodeChange}
        options={{ fontSize: 14, minimap: { enabled: false } }}
      />

      <button
        onClick={runCode}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Running..." : "Run Code"}
      </button>

      <div className="mt-4 p-4 bg-gray-100 border rounded">
        <h2 className="text-lg font-semibold">Output:</h2>
        <pre className="mt-2 p-2 bg-black text-white rounded">{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
