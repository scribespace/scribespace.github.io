import { useMainThemeContext } from "@/mainThemeContext";
import { $getAllActionScopes } from "@systems/shortcutManager/action";
import { $shortcutToString } from "@systems/shortcutManager/shortcut";
import { ReactNode, useMemo } from "react";
import { Dialog } from "../dialog/dialog";
import { SHORTCUTS_OPEN_DIALOG_CMD } from "./shortcutsCommands";



function Shortcuts() {
    const {commonTheme: {shortcutsTheme}} = useMainThemeContext();

    const shortcuts = useMemo(
        () => {
            let key = 0;
            const reactNodes: ReactNode[] = [];

            const allScopes = $getAllActionScopes();
            for (const scope of allScopes ) {

                const rows: ReactNode[] = [];
                for ( const [,action] of scope.actions ) {
                    rows.push((
                        <div key={key++} className={shortcutsTheme.row}>
                            <div key={key++} className={shortcutsTheme.cell}>
                                {$shortcutToString(action.shortcut)}
                            </div>
                            <div key={key++} className={shortcutsTheme.cell}>
                                {action.label}
                            </div>
                        </div>
                        ));
                }
                const scopeRoot = (
                    <div key={key++}  className={shortcutsTheme.scopeRoot}>
                        <div key={key++} className={shortcutsTheme.scopeName}>{scope.name}</div>
                            <div key={key++} className={shortcutsTheme.cellsContainer}>
                                {rows}
                            </div>
                    </div>
                );
                reactNodes.push(scopeRoot);
            }

            return (
                <div key={key++} className={shortcutsTheme.container}>
                    {reactNodes}
                </div>
            );
        },
        [shortcutsTheme.cell, shortcutsTheme.cellsContainer, shortcutsTheme.container, shortcutsTheme.row, shortcutsTheme.scopeName, shortcutsTheme.scopeRoot]
    );

    return shortcuts;
}

export function ShortcutsDialog() {
    return (
        <Dialog commandOpen={SHORTCUTS_OPEN_DIALOG_CMD}>
            <Shortcuts/>
        </Dialog>
    );
}