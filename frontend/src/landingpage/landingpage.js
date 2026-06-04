import React, { useState, useEffect } from "react";
import "./landingpage.css";
import SummaryDisplay from "./SummaryDisplay";
import { useNavigate } from "react-router-dom";

// Here I Imported PDF.js via CDN dynamically.
const pdfjsLibUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js";
const pdfWorkerUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const extractTextFromPDF = async (pdfFile) => {
    setIsExtracting(true);
    const pdfjsLib = window.pdfjsLib || (await import(/* @vite-ignore */ pdfjsLibUrl));
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let textContent = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      textContent += `\n\n--- Page ${pageNum} ---\n${pageText}`;
    }

    setIsExtracting(false);
    return textContent.trim();
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput && !file) return;

    const userMessage = {
      sender: "user",
      text: trimmedInput,
      fileName: file ? file.name : null,
    };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
    setFile(null);

    let extractedText = "";
    if (file) {
      try {
        extractedText = await extractTextFromPDF(file);
      } catch (err) {
        console.error("PDF extraction error:", err);
        extractedText = "⚠️ Failed to extract text from PDF.";
      }
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: trimmedInput,
            text: extractedText,
          }),
        }
      );

      const data = await res.json();

      const aiMessage = {
        sender: "ai",
        text: data.summary || "No summary generated.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error connecting to backend." },
      ]);
    }
  };

  return (
    <section className="landing-section">
      <div className="chat-container">
        <h2>Research Paper Summarizer</h2>

        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.fileName && (
                <p className="file-attachment">📎 {msg.fileName}</p>
              )}

              {msg.sender === "ai" ? (
                <SummaryDisplay summary={msg.text} />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          ))}
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <label htmlFor="fileInput" className="file-label">
            📎
          </label>

          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />

          {file && (
            <span className="selected-file-name">{file.name}</span>
          )}

          <input
            type="text"
            placeholder={
              isExtracting
                ? "Extracting PDF text..."
                : file
                ? `Add prompt for ${file.name}...`
                : "Type your prompt or attach a PDF..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isExtracting}
          />

          <button type="submit" disabled={isExtracting}>
            {isExtracting ? "⏳" : "➤"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LandingPage;
