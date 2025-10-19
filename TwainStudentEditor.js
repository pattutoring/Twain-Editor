import React, { useState, useRef, useEffect } from "https://esm.sh/react";

export default function TwainStudentEditor() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);
  const editorRef = useRef();

  const dictionary = ["the","and","to","of","a","in","is","it","you","that","he","was","for","on","are","with","as","I","his","they","be","at","one","have","this","from","or","had","by","but","not","word","words","sentence","write","plain","simple","short"];

  const rules = [
    { class:"fancy-word", message:'Avoid fancy words.', regex:/\b(utilize|commence|ascertain|ameliorate|endeavor|employ)\b/i },
    { class:"adjective", message:"Be cautious with adjectives.", regex:/\b\w+ly\b/g },
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

  // Tokenize text and wrap highlights
  const getHighlightedHTML = (input) => {
    // escape HTML
    let escaped = input.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

    // Split words and punctuation
    const tokens = escaped.split(/(\s+)/); // keep spaces

    const highlightedTokens = tokens.map(token => {
      let modified = token;
      // rule highlights
      rules.forEach(r => {
        if(r.regex.test(token)) {
          modified = `<span class="highlight ${r.class}" title="${r.message}">${token}</span>`;
        }
      });
      // spell check
      if(/^\w+$/.test(token) && !dictionary.includes(token.toLowerCase())) {
        modified = `<span class="highlight spell-error" title="Possible spelling error">${token}</span>`;
      }
      return modified;
    });

    return highlightedTokens.join("");
  };

  const handleInput = (e) => {
    setText(e.target.innerText);
  };

  useEffect(()=>{
    if(editorRef.current){
      // save caret
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      const startOffset = range.startOffset;
      const startContainer = range.startContainer;

      editorRef.current.innerHTML = getHighlightedHTML(text);

      // restore caret
      if(editorRef.current.firstChild){
        const newRange = document.createRange();
        let container = editorRef.current.firstChild;
        let offset = Math.min(startOffset, container.textContent.length);
        newRange.setStart(container, offset);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    }
  }, [text]);

  const analyze = () => {
    const found = rules.filter(r => r.regex.test(text));
    setFeedback(found);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split("\n").length;

  return React.createElement(
    "div",
    null,
    React.createElement("div",{className:"editor-wrapper"},
      React.createElement("div",{className:"line-numbers"}, Array.from({length:lines},(_,i)=>i+1).join("\n")),
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
