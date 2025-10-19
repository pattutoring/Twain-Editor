import React, { useState, useEffect, useRef } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);
  const editorRef = useRef();

  // Twain rules
  const rules = [
    { message: 'Avoid fancy words — "Don’t use a five-dollar word when a fifty-cent word will do."', test: t => /\b(utilize|commence|ascertain|ameliorate|endeavor|employ)\b/i.test(t), highlight: /\b(utilize|commence|ascertain|ameliorate|endeavor|employ)\b/gi },
    { message: 'Use plain, simple language, short words, and brief sentences.', test: t => /\b(simple|plain|short)\b/i.test(t), highlight: /\b(simple|plain|short)\b/gi },
    { message: "Be cautious with adjectives.", test: t => /\b\w+ly\b/.test(t), highlight: /\b\w+ly\b/g },
    { message: 'Substitute "damn" for "very".', test: t => /\bvery\b/i.test(t), highlight: /\bvery\b/gi },
    { message: "Choose the precise word; avoid 'almost right' vs 'right' confusion.", test: t => /\balmost right\b/i.test(t), highlight: /\balmost right\b/gi },
    { message: "Avoid alliteration.", test: t => /\b(\w)\w*\s+\1\w*\b/i.test(t), highlight: /\b(\w)\w*\s+\1\w*\b/gi },
    { message: "Don’t end sentences with prepositions.", test: t => /\b\w+\s+(in|on|at|by|with|for)\.\s*$/i.test(t), highlight: /\b\w+\s+(in|on|at|by|with|for)\.\s*$/gi },
    { message: "Avoid clichés.", test: t => /\b(once in a lifetime|at the end of the day|in the nick of time|old hat)\b/i.test(t), highlight: /\b(once in a lifetime|at the end of the day|in the nick of time|old hat)\b/gi },
    { message: "Avoid comparisons.", test: t => /as\s+.*\s+as/i.test(t), highlight: /as\s+.*\s+as/gi },
    { message: "Be more or less specific; avoid generalizations.", test: t => /\b(any|all|always|never)\b/i.test(t), highlight: /\b(any|all|always|never)\b/gi },
    { message: "Don’t be redundant; avoid unnecessary words.", test: t => /\b(redundant|unnecessary|superfluous|obfuscates)\b/i, highlight: /\b(redundant|unnecessary|superfluous|obfuscates)\b/gi },
    { message: "Avoid rhetorical questions.", test: t => /\?\s*$/i.test(t), highlight: /\?\s*$/gi },
    { message: "Exaggeration is worse than understatement.", test: t => /\b(nearly|extremely|tremendously|huge|gigantic)\b/i, highlight: /\b(nearly|extremely|tremendously|huge|gigantic)\b/gi },
    { message: "Catch spelling errors.", test: t => false, highlight: null } // optional: integrate a spell checker later
  ];

  // Highlight text inside contenteditable
  const getHighlightedText = (input) => {
    let escaped = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    rules.forEach(r => {
      if (r.highlight) {
        escaped = escaped.replace(r.highlight, match => `<span class="highlight">${match}</span>`);
      }
    });
    return escaped;
  };

  // Update feedback based on rules
  const analyze = () => {
    const found = rules.filter(r => r.test(text));
    setFeedback(found);
  };

  // Handle typing in contenteditable
  const handleInput = (e) => {
    const newText = e.target.innerText;
    setText(newText);
  };

  useEffect(() => {
    // live highlighting
    if (editorRef.current) {
      editorRef.current.innerHTML = getHighlightedText(text);
    }
  }, [text]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return React.createElement(
    "div",
    null,
    React.createElement("div", {
      ref: editorRef,
      className: "editor",
      contentEditable: true,
      onInput: handleInput,
      spellCheck: true,
      placeholder: "Write like Twain would..."
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
      { className: "mt-4", style: { color: "green", fontWeight: "bold" } },
      "No issues found — Twain himself might nod in approval!"
    )
  );
}
