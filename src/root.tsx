import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { MainApp } from "./mainApp";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { ERROR_OPEN_DIALOG } from "./components/errorHandling/errorCommands";


function errorHandler(event: ErrorEvent) {
  $callCommand(ERROR_OPEN_DIALOG, event.error);
}

window.addEventListener('error', errorHandler);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
);
