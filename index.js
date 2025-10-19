import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom/client";
import TwainStudentEditor from "./TwainStudentEditor.js";

const container = document.getElementById("editor-container");
const root = ReactDOM.createRoot(container);

root.render(
  React.createElement(TwainStudentEditor)
);

