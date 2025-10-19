import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import TwainStudentEditor from "./TwainStudentEditor.js";

// Render the Twain Editor
ReactDOM.render(
  React.createElement(TwainStudentEditor, { title: "Your Twain Editor" }),
  document.getElementById("editor-container")
);
