// src/SummaryDisplay.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function SummaryDisplay({ summary }) {
  // Remove any stray intro text before first ## (like “Okay, here’s a summary…”)
  const cleanSummary = (summary || "").replace(/^.*?(?=^## )/ms, "");
  const sections = cleanSummary.split(/(?=^## )/m).filter(Boolean);

  return (
    <div
      className="text-white p-8 rounded-2xl bg-gray-900/95 border border-gray-800 shadow-2xl 
                 overflow-y-auto max-h-[75vh] space-y-8 leading-relaxed tracking-wide font-[Inter]"
      style={{
        lineHeight: "1.8",
        letterSpacing: "0.02em",
      }}
    >
      {sections.length === 0 ? (
        <div className="text-gray-400 italic text-center py-6">
          No formatted sections found. Please include ## headings in the summary.
        </div>
      ) : (
        sections.map((section, index) => (
          <Section key={index} content={section.trim()} />
        ))
      )}
    </div>
  );
}

function Section({ content }) {
  const lines = content.split("\n");
  const heading = lines[0].replace(/^##\s*/, "").trim();
  const body = lines.slice(1).join("\n").trim();

  return (
    <div
      className="rounded-2xl border border-gray-800 bg-gray-800/70 shadow-lg 
                 p-6 hover:shadow-teal-500/20 transition-all duration-300"
    >
      {/* Heading */}
      <div className="flex items-center mb-5">
        <div className="w-1 h-6 bg-teal-500 rounded-full mr-3"></div>
        <h2 className="text-2xl font-semibold text-teal-400 tracking-wide text-left font-[Poppins]">
          {heading || "Untitled Section"}
        </h2>
      </div>

      {/* Body */}
      {body ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, children, ...props }) => (
              <p
                className="text-gray-200 mb-5 text-justify text-[1rem] font-normal"
                {...props}
              >
                {children}
              </p>
            ),
            ul: ({ node, children, ...props }) => (
              <ul
                className="list-disc ml-8 mb-5 text-gray-200 space-y-3 text-[1rem]"
                {...props}
              >
                {children}
              </ul>
            ),
            li: ({ node, children, ...props }) => (
              <li className="leading-relaxed" {...props}>
                {children}
              </li>
            ),
            strong: ({ node, children, ...props }) => (
              <strong className="text-white font-semibold" {...props}>
                {children}
              </strong>
            ),
            em: ({ node, children, ...props }) => (
              <em className="text-gray-400 italic" {...props}>
                {children}
              </em>
            ),
            h3: ({ node, children, ...props }) => (
              <h3
                className="text-lg font-semibold text-emerald-300 mt-6 mb-3 tracking-wide"
                {...props}
              >
                {children}
              </h3>
            ),
            hr: () => <hr className="border-gray-700 my-6" />,
          }}
        >
          {body}
        </ReactMarkdown>
      ) : (
        <div className="text-gray-400 text-sm italic">
          No content found for this section.
        </div>
      )}
    </div>
  );
}

export default SummaryDisplay;
