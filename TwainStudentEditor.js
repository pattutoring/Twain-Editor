import React, { useState } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);

  const rules = [
    { rule: "Avoid fancy words", test: t => /\b(utilize|commence|ascertain|ameliorate|endeavor|employ)\b/i.test(t), message: "Use simpler words." },
    { rule: "Be cautious with adjectives", test: t => /\b\w+ly\b/i.test(t), message: "Too many adjectives/adverbs." },
    { rule: "Substitute 'damn' for 'very'", test: t => /\bvery\b/i.test(t), message: "Consider 'damn' instead of 'very'." },
    { rule: "Avoid almost right", test: t => /\balmost right\b/i.test(t), message: "Choose the precise word." },
    { rule: "Avoid alliteration", test: t => /\b(\w)\w*\s+\1\w*\b/i.test(t), message: "Alliteration detected." },
    { rule: "Avoid clichés", test: t => /\b(once in a lifetime|at the end of the day|in the nick of time|old hat)\b/i.test(t), message: "Replace clichés with original phrasing." },
    { rule: "Avoid redundancy", test: t => /\b(redundant|unnecessary|superfluous|obfuscates)\b/i.test(t), message: "Remove redundant words." },
    { rule: "Avoid rhetorical questions", test: t => /\?\s*$/.test(t), message: "Rhetorical question detected." },
    { rule: "Avoid exaggeration", test: t => /\b(nearly|extremely|tremendously|huge|gigantic)\b/i.test(t), message: "Exaggeration detected." }
  ];

  const analyze = () => {
    const found = rules.filter(r => r.test(text));
    setFeedback(found);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="editor-container">
      <textarea
        placeholder="Write like Twain would..."
        value={text}
        onChange={e => setText(e.target.value)}
      ></textarea>

      <div style={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
        <p>Word count: {wordCount}</p>
        <button onClick={analyze}>Analyze</button>
      </div>

      {feedback.length > 0 && (
        <div className="feedback">
          {feedback.map((f,i)=><div key={i}>{f.message}</div>)}
        </div>
      )}
    </div>
  );
}
