import React, { useState, useRef } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [highlighted, setHighlighted] = useState("");
  const editorRef = useRef();

  const dictionary = ["the","and","to","of","a","in","is","it","you","that","he","was","for","on","are","with","as","I","his","they","be","at","one","have","this","from","or","had","by","but","not","word","words","sentence","write","plain","simple","short"];

  const rules = [
    { class:"fancy-word", message:'Avoid fancy words.', regex:/\b(utilize|commence|ascertain|ameliorate|endeavor|employ)\b/gi },
    { class:"adjective", message:"Be cautious with adjectives.", regex:/\b\w+ly\b/gi },
    { class:"very-word", message:'Substitute "damn" for "very".', regex:/\bvery\b/gi },
    { class:"almost-right", message:"Avoid 'almost right' vs 'right'.", regex:/\balmost right\b/gi },
    { class:"alliteration", message:"Avoid alliteration.", regex:/\b(\w)\w*\s+\1\w*\b/gi },
    { class:"preposition", message:"Don’t end sentences with prepositions.", regex:/\b\w+\s+(in|on|at|by|with|for)\.\s*$/gi },
    { class:"cliche", message:"Avoid clichés.", regex:/\b(once in a lifetime|at the end of the day|in the nick of time|old hat)\b/gi },
    { class:"comparison", message:"Avoid comparisons.", regex:/as\s+.*\s+as/gi },
    { class:"redundant", message:"Don’t be redundant.", regex:/\b(redundant|unnecessary|superfluous|obfuscates)\b/gi },
    { class:"rhetorical", message:"Avoid rhetorical questions.", regex:/\?\s*$/gi },
    { class:"exaggeration", message:"Exaggeration is worse than understatement.", regex:/\b(nearly|extremely|tremendously|huge|gigantic)\b/gi }
  ];

  const handleInput = (e) => {
    setText(e.target.innerText);
  };

  const analyze = () => {
    let highlightedText = text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    
    // Highlight rules
    rules.forEach(r => {
      highlightedText = highlightedText.replace(r.regex, match => `<span class="highlight ${r.class}" title="${r.message}">${match}</span>`);
    });

    // Spell check
    highlightedText = highlightedText.replace(/\b(\w+)\b/g, (match) => {
      if (!dictionary.includes(match.toLowerCase())) {
        return `<span class="highlight spell-error" title="Possible spelling error">${match}</span>`;
      }
      return match;
    });

    setHighlighted(highlightedText);

    const found = rules.filter(r => r.regex.test(text));
    setFeedback(found);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split("\n").length;

  return (
    <div>
      <div className="editor-wrapper">
        <div className="line-numbers">
          {Array.from({length:lines}, (_,i) => i+1).join("\n")}
        </div>
        <div
          ref={editorRef}
          className="editor"
          contentEditable
          spellCheck={false}
          onInput={handleInput}
        >
          {/* show plain text while typing */}
          <div dangerouslySetInnerHTML={{__html: highlighted || text}} />
        </div>
      </div>

      <div style={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
        <p>Word count: {wordCount}</p>
        <button onClick={analyze}>Analyze</button>
      </div>

      {feedback.length > 0 && (
        <div className="feedback" dangerouslySetInnerHTML={{__html: feedback.map(f=>f.message).join("<br>")}} />
      )}
    </div>
  );
}
