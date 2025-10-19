import React, { useState } from "https://esm.sh/react";

export default function TwainStudentEditor({ title }) {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);

  const rules = [
    {
      rule: "Use plain, simple language instead of fancy words.",
      test: (t) => /\b(utilize|commence|ascertain|ameliorate|endeavor)\b/i.test(t),
      message:
        "Try simpler words — Twain advised: 'Use plain, simple language, short words, and brief sentences.'",
    },
    {
      rule: "Avoid needless adjectives.",
      test: (t) => /\b\w+ly\b/.test(t),
      message: "Beware of too many adverbs or adjectives — Twain warned against 'adjectivitis.'",
    },
    {
      rule: "Be concise — avoid unnecessary words.",
      test: (t) => t.split(" ").length > 150,
      message:
        "This passage might be too long — Twain said, 'When you catch an adjective, kill it.'",
    },
    {
      rule: "Show, don't tell — avoid clichés.",
      test: (t) => /\b(once in a lifetime|at the end of the day|in the nick of time)\b/i.test(t),
      message: "Replace clichés with vivid imagery — Twain valued originality.",
    },
  ];

  const analyze = () => {
    const found = rules.filter((r) => r.test(text));
    setFeedback(found);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return React.createElement(
    "div",
    { className: "bg-white rounded-2xl shadow-lg p-6 w-full" },
    React.createElement("h1", { className: "text-2xl font-bold mb-4 text-center" }, title),
    React.createElement("textarea", {
      className: "w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none",
      placeholder: "Write like Twain would...",
      value: text,
      onChange: (e) => setText(e.target.value)
    }),
    React.createElement(
      "div",
      { className: "flex justify-between items-center mt-3" },
      React.createElement("p", { className: "text-gray-600 text-sm" },
        "Word count: ", React.createElement("span", { className: "font-semibold" }, wordCount)
      ),
      React.createElement("button", {
        onClick: analyze,
        className: "bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
      }, "Analyze")
    ),
    feedback.length > 0 && React.createElement(
      "div",
      { className: "mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4" },
      React.createElement("h2", { className: "font-semibold mb-2 text-yellow-800" }, "Twain’s Suggestions:"),
      React.createElement("ul", { className: "list-disc ml-5 space-y-1 text-yellow-700" },
        feedback.map((f, i) => React.createElement("li", { key: i }, f.message))
      )
    ),
    feedback.length === 0 && text.length > 0 && React.createElement(
      "p",
      { className: "mt-4 text-green-700 font-medium" },
      "No issues found — Twain himself might nod in approval!"
    )
  );
}
