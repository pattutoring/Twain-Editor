import React, { useState, useRef, useEffect } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);
  const editorRef = useRef();

  const dictionary = ["the","and","to","of","a","in","is","it","you","that","he","was","for","on","are","with","as","I","his","they","be","at","one","have","this","from","or","had","by","but","not","word","words","sentence","write","plain","simple","short"];

  const rules = [
    { class:"fancy-word", message:'Avoid fancy words.', test:/\b(utilize|commence|ascertain|ameliorate|endeavor|employ)\b/i },
    { class:"adjective", message:"Be cautious with adjectives.", test:/\b\w+ly\b/g },
    { class:"very-word", message:'Substitute "damn" for "very".', test:/\bvery\b/gi },
    { class:"almost-right", message:"Avoid 'almost right' vs 'right'.", test:/\balmost right\b/gi },
    { class:"alliteration", message:"Avoid alliteration.", test:/\b(\w)\w*\s+\1\w*\b/gi },
    { class:"preposition", message:"Don’t end sentences with prepositions.", test:/\b\w+\s+(in|on|at|by|with|for)\.\s*$/gi },
    { class:"cliche", message:"Avoid clichés.", test:/\b(once in a lifetime|at the end of the day|in the nick of time|old hat)\b/gi },
    { class:"comparison", message:"Avoid comparisons.", test:/as\s+.*\s+as/gi },
    { class:"redundant", message:"Don’t be redundant.", test:/\b(redundant|unnecessary|superfluous|obfuscates)\b/gi },
    { class:"rhetorical", message:"Avoid rhetorical questions.", test:/\?\s*$/gi },
    { class:"exaggeration", message:"Exaggeration is worse than understatement.", test:/\b(nearly|extremely|tremendously|huge|gigantic)\b/gi }
  ];

  const highlightText = (input) => {
    let escaped = input.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

    // Apply rules
    rules.forEach(r => {
      escaped = escaped.replace(r.test, match => `<span class="highlight ${r.class}" title="${r.message}">${match}</span>`);
    });

    // Spell check
    escaped = escaped.replace(/\b(\w+)\b/g,(match)=>{
      if(!dictionary.includes(match.toLowerCase())){
        return `<span class="highlight spell-error" title="Possible spelling error">${match}</span>`;
      }
      return match;
    });

    return escaped;
  };

  const handleInput = (e) => {
    const sel = window.getSelection();
    const pos = sel.focusOffset;
    const newText = e.target.innerText;
    setText(newText);
    // preserve caret
    setTimeout(() => {
      const range = document.createRange();
      range.setStart(editorRef.current.childNodes[0] || editorRef.current, pos);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0);
  };

  useEffect(()=>{
    if(editorRef.current){
      editorRef.current.innerHTML = highlightText(text);
    }
  },[text]);

  const analyze = () => {
    const found = rules.filter(r => r.test.test(text));
    setFeedback(found);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // line numbers
  const lines = text.split("\n").length;

  return React.createElement(
    "div",
    null,
    React.createElement("div",{className:"editor-wrapper"},
      React.createElement("div",{className:"line-numbers"}, Array.from({length:lines}, (_,i)=>i+1).join("\n")),
      React.createElement("div",{
        ref: editorRef,
        className:"editor",
        contentEditable:true,
        spellCheck:false,
        onInput:handleInput,
      })
    ),
    React.createElement(
      "div",
      {style:{display:"flex", justifyContent:"space-between", marginTop:"10px"}},
      React.createElement("p",null,"Word count: ",wordCount),
      React.createElement("button",{onClick:analyze},"Analyze")
    ),
    feedback.length>0 && React.createElement(
      "div",{className:"feedback", dangerouslySetInnerHTML:{__html:feedback.map(f=>f.message).join("<br>")}}
    )
  );
}
