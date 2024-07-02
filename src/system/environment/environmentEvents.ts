import { ERROR_OPEN_DIALOG } from "@/components/errorHandling/errorCommands";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { TREE_SELECT_NOTE_CMD } from "@systems/treeManager";

function historyChange() {
    const treeNodeToSelect = window.location.pathname.slice(1);
    if ( treeNodeToSelect != '' ) {
        $callCommand(TREE_SELECT_NOTE_CMD, {treeNodeID: treeNodeToSelect, commandSrc:'history'} );
    }
  }
  
  window.addEventListener('popstate', historyChange);

  function errorHandler(event: ErrorEvent) {
    $callCommand(ERROR_OPEN_DIALOG, event.error);
  }
  
  window.addEventListener('error', errorHandler);