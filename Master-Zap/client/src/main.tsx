import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installStaticApi } from "./lib/static-api";

if (import.meta.env.VITE_STATIC) installStaticApi();

createRoot(document.getElementById("root")!).render(<App />);
