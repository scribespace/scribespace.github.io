import { $getAllActionScopes, GLOBAL_ACTION_SCOPE, $callAction, $getActionScope } from "@systems/shortcutManager/action";
import { $shortcutFromKeyboardEvent, $packShortcut, INVALID_SHORTCUT } from "@systems/shortcutManager/shortcut";
import { variableExists } from "@utils";
import { useCallback, useEffect } from "react";

export function Actions() {
    const shortcutEvent = useCallback( 
        (event: KeyboardEvent) => {
            
            const shortcut = $shortcutFromKeyboardEvent(event);
            const packedShortcut = $packShortcut(shortcut);
            if ( packedShortcut === INVALID_SHORTCUT ) {
                return ;
            }
            
            const allScopes = $getAllActionScopes();
            const scopesCount = allScopes.length;
            
            for ( let sID = 0; sID < scopesCount; ++sID ) {
                const scope = allScopes[sID];
                if ( sID == GLOBAL_ACTION_SCOPE.id || !document.getElementById(scope.elementID)?.contains(event.target as Node) )
                    continue;
                

                const cmd = scope.actions.get(packedShortcut);
                if ( variableExists(cmd) ) {
                    $callAction(cmd);
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
            }
            
            const cmd = $getActionScope(GLOBAL_ACTION_SCOPE).actions.get(packedShortcut);
            if ( variableExists(cmd) ) {
                $callAction(cmd);
                event.stopPropagation();
                event.preventDefault();
                return;
            }
        },
        []
       );
    
       useEffect(
        () => {
          document.addEventListener("keydown", shortcutEvent);
          return () => { document.removeEventListener("keydown", shortcutEvent); };
        },
        [shortcutEvent]
       );

       return null;
}