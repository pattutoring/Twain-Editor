import React, { useState, useEffect, useRef } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);
  const editorRef = useRef();
  const lineRef = useRef();

  const dictionary = ["the","and","to","of","a","in","is","it","you","that","he","was"];

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

  const highlightText = (input) => {
    const escaped = input
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/\n/g,"<br>");
    const words = escaped.split(/(\s+)/).map(word => {
      let w = word;
      rules.forEach(r => { if(r.regex.test(word)) w=`<span class="highlight ${r.class}" title="${r.message}">${word}</span>`; });
      if(/^\w+$/.test(word) && !dictionary.includes(word.toLowerCase())) w=`<span class="highlight spell-error" title="Possible spelling error">${word}</span>`;
      return w;
    });
    return words.join("");
  };

  useEffect(() => {
    if(editorRef.current){
      editorRef.current.innerHTML = highlightText(text);
      placeCaretAtEnd(editorRef.current);
    }
  }, [text]);

  const placeCaretAtEnd = (el) => {
    el.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const analyze = () => {
    const found = rules.filter(r => r.regex.test(text));
    setFeedback(found);
  };

  return (
    <div>
      <div className="editor-container">
        <div className="line-numbers">
          {text.split("\n").map((_,i)=>i+1).join("\n")}
        </div>
        <div className="editor-wrapper">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="content-editor"
          ></div>
        </div>
      </div>

      <div style={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
        <p>Word count: {text.trim().split(/\s+/).filter(w=>w).length}</p>
        <button onClick={analyze}>Analyze</button>
      </div>

      {feedback.length>0 && (
        <div className="feedback">
          {feedback.map((f,i)=><div key={i}>{f.message}</div>)}
        </div>
      )}
    </div>
  );
}
