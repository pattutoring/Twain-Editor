import React, { useState, useEffect, useRef } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);
  const editorRef = useRef();

  // Simplified spell checker dictionary (expand as needed)
  const dictionary = ["the","and","to","of","a","in","is","it","you","that","he","was","for","on","are","with","as","I","his","they","be","at","one","have","this","from","or","had","by","but","not","word","words","sentence","write","plain","simple","short"];

  // Twain rules
  const rules = [
    { class: "fancy-word", message: 'Avoid fancy words — "Don’t use a five-dollar word when a fifty-cent word will do."', test: t => /\b(utilize|commence|ascertain|ameliorate|endeavor|employ)\b/i, highlight: /\b(utilize|commence|ascertain|ameliorate|endeavor|employ)\b/gi },
    { class: "adjective", message: "Be cautious with adjectives.", test: t => /\b\w+ly\b/.test(t), highlight: /\b\w+ly\b/g },
    { class: "very-word", message: 'Substitute "damn" for "very".', test: t => /\bvery\b/i, highlight: /\bvery\b/gi },
    { class: "almost-right", message: "Choose the precise word; avoid 'almost right' vs 'right'.", test: t => /\balmost right\b/i, highlight: /\balmost right\b/gi },
    { class: "alliteration", message: "Avoid alliteration.", test: t => /\b(\w)\w*\s+\1\w*\b/i, highlight: /\b(\w)\w*\s+\1\w*\b/gi },
    { class: "preposition", message: "Don’t end sentences with prepositions.", test: t => /\b\w+\s+(in|on|at|by|with|for)\.\s*$/i, highlight: /\b\w+\s+(in|on|at|by|with|for)\.\s*$/gi },
    { class: "cliche", message: "Avoid clichés.", test: t => /\b(once in a lifetime|at the end of the day|in the nick of time|old hat)\b/i, highlight: /\b(once in a lifetime|at the end of the day|in the nick of time|old hat)\b/gi },
    { class: "comparison", message: "Avoid comparisons.", test: t => /as\s+.*\s+as/i, highlight: /as\s+.*\s+as/gi },
    { class: "redundant", message: "Don’t be redundant; avoid unnecessary words.", test: t => /\b(redundant|unnecessary|superfluous|obfuscates)\b/i, highlight: /\b(redundant|unnecessary|superfluous|obfuscates)\b/gi },
    { class: "rhetorical", message: "Avoid rhetorical questions.", test: t => /\?\s*$/i, highlight: /\?\s*$/gi },
    { class: "exaggeration", message: "Exaggeration is worse than understatement.", test: t => /\b(nearly|extremely|tremendously|huge|gigantic)\b/i, highlight: /\b(nearly|extremely|tremendously|huge|gigantic)\b/gi }
  ];

  const getHighlightedText = (input) => {
    let escaped = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Rule highlights with tooltip
    rules.forEach(r => {
      if (r.highlight) {
        escaped = escaped.replace(r.highlight, match => `<span class="highlight ${r.class}" title="${r.message}">${match}</span>`);
      }
    });

    // Spell check highlighting
    escaped = escaped.replace(/\b(\w+)\b/g, (match) => {
      if (!dictionary.includes(match.toLowerCase())) {
        return `<span class="highlight spell-error" title="Possible spelling error">${match}</span>`;
      }
      return match;
    });

    return escaped;
  };

  const analyze = () => {
    const found = rules.filter(r => r.test(text));
    setFeedback(found);
  };

  const handleInput = (e) => {
    const newText = e.target.innerText;
    setText(newText);
  };

  useEffect(() => {
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
      spellCheck: false,
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
    )
  );
}
