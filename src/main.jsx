import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";


// const style = document.createElement("style");
// style.textContent = `
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   body { font-family: Inter, -apple-system, sans-serif; background: #f8fafc; color: #111827; }
//   a { color: inherit; }
//   #nprogress .bar { background: #15803D !important; height: 3px !important; }
//   #nprogress .peg { box-shadow: 0 0 10px #15803D, 0 0 5px #15803D !important; }
// `;
// document.head.appendChild(style);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
