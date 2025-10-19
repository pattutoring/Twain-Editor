import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom/client"; // note the /client
import TwainStudentEditor from "./TwainStudentEditor.js";

// Get the container
const container = document.getElementById("editor-container");

// Create a root
const root = ReactDOM.createRoot(container);

// Render the editor
root.render(
  React.createElement(TwainStudentEditor, { title: "Your Twain Editor" })
);
