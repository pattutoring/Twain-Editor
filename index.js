import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import TwainStudentEditor from "./TwainStudentEditor.js";




ReactDOM.render(
  React.createElement(TwainStudentEditor, {
    title: "PAT Tutoring — Twain Writing Practice",
  }),
  document.getElementById("root")
);
