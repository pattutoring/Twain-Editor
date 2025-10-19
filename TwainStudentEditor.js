import React, { useState } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);

  const rules = [
    {
      rule: "Use plain, simple language instead of fancy words.",
      test: (t) => /\b(utilize|commence|ascertain|ameliorate|endeavor)\b/i.test(t),
      message:
        "Try simpler words — Twain advised: 'Use plain, simple language, short words, and brief sentences.'",
      highlight: /\b(utilize|commence|ascertain|ameliorate|endeavor)\b/gi
    },
    {
      rule: "Avoid needless adjectives.",
      test: (t) => /\b\w+ly\b/.test(t),
      message: "Beware of too many adverbs or adjectives — Twain warned against 'adjectivitis.'",
      highlight: /\b\w+ly\b/g
    },
    {
      rule: "Be concise — avoid unnecessary words.",
      test: (t) => t.split(" ").length > 150,
      message:
        "This passage might be too long — Twain said, 'When you catch an adjective, kill it.'",
      highlight: null
    },
    {
      rule: "Show, don't tell — avoid clichés.",
      test: (t) => /\b(once in a lifetime|at the end of the day|in the nick of time)\b/i.test(t),
      message: "Replace clichés with vivid imagery — Twain valued originality.",
      highlight: /\b(once in a lifetime|at the end of the day|in the nick of time)\b/gi
    },
  ];

  const analyze = () => {
    const found = rules.filter((r) => r.test(text));
    setFeedback(found);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Highlight the text based on rules
  const getHighlightedText = () => {
    let highlighted = text;
    rules.forEach(r => {
      if (r.highlight) {
        highlighted = highlighted.replace(r.highlight, match => `<span class="highlight">${match}</span>`);
      }
    });
    return highlighted;
  };

  return React.createElement(
    "div",
    null,
    React.createElement("textarea", {
      placeholder: "Write like Twain would...",
      value: text,
      onChange: (e) => setText(e.target.value)
    }),
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "space-between", marginTop: "10px" } },
      React.createElement("p", null, "Word count: ", wordCount),
      React.createElement("button", { onClick: analyze }, "Analyze")
    ),
    feedback.length > 0 && React.createElement(
      "div",
      { className: "feedback", dangerouslySetInnerHTML: { __html: feedback.map(f => f.message).join("<br>") } }
    ),
    feedback.length === 0 && text.length > 0 && React.createElement(
      "p",
      { className: "mt-4 text-green-700 font-medium" },
      "No issues found — Twain himself might nod in approval!"
    )
  );
}
