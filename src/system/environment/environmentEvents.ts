import { ERROR_OPEN_DIALOG } from "@/components/errorHandling/errorCommands";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { TREE_SELECT_NOTE_CMD } from "@systems/treeManager";
import { $getTreeNodeIDFromURL } from "./environment";
import { APP_GET_FOCUS } from "@systems/systemCommands";

function historyChange() {
    const treeNodeToSelect = $getTreeNodeIDFromURL();
    if ( treeNodeToSelect != '' ) {
        $callCommand(TREE_SELECT_NOTE_CMD, {treeNodeID: treeNodeToSelect, commandSrc:'history'} );
    }
  }
  
  window.addEventListener('popstate', historyChange);

  function errorHandler(event: ErrorEvent) {
    $callCommand(ERROR_OPEN_DIALOG, event.error);
  }
  
  window.addEventListener('error', errorHandler);

  function onfocus() {
    $callCommand(APP_GET_FOCUS, undefined);
  }

  window.addEventListener('focus', onfocus);