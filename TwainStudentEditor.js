import React, { useState, useRef, useEffect } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);
  const textareaRef = useRef();
  const overlayRef = useRef();

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

  // Generate highlighted HTML
  const getHighlighted = (input) => {
    let escaped = input.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const tokens = escaped.split(/(\s+)/);
    return tokens.map(token => {
      let t = token;
      rules.forEach(r => { if(r.regex.test(token)) t=`<span class="highlight ${r.class}" title="${r.message}">${token}</span>`; });
      if(/^\w+$/.test(token) && !dictionary.includes(token.toLowerCase())) t=`<span class="highlight spell-error" title="Possible spelling error">${token}</span>`;
      return t;
    }).join("");
  };

  const handleInput = (e) => {
    setText(e.target.value);
  };

  useEffect(()=>{
    if(overlayRef.current){
      overlayRef.current.innerHTML = getHighlighted(text);
    }
  }, [text]);

  const analyze = () => {
    const found = rules.filter(r => r.regex.test(text));
    setFeedback(found);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="editor-container">
      <div style={{position:'relative'}}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          placeholder="Write like Twain..."
        />
        <div ref={overlayRef} className="highlight-overlay"></div>
      </div>

      <div style={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
        <p>Word count: {wordCount}</p>
        <button onClick={analyze}>Analyze</button>
      </div>

      {feedback.length>0 && (
        <div className="feedback" dangerouslySetInnerHTML={{__html: feedback.map(f=>f.message).join("<br>")}} />
      )}
    </div>
  );
}
