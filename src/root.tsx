import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { MainApp } from "./mainApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
);
