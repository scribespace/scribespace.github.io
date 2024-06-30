import { Command } from "@systems/commandsManager/command";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { assert, variableExists } from "@utils";
import { $packShortcut, NO_SHORTCUT_PACKED, PackedShortcut, Shortcut } from "./shortcut";
import { isDev } from "@systems/environment";

export interface ActionScopeID {
    id: number;
}

export interface Action<P> {
    name?: string;
    label: string;
    shortcut: Shortcut;
    defaultPayload: P;
    command?: Command<P>;
}

export interface ActionScope {
    name: string;
    elementID: string;
    actions: Map<PackedShortcut, Action<unknown>>;
}

export interface ActionManager {
    scopes: ActionScope[];
}

export function $createActionManager(): ActionManager {
    return { scopes: [] };
}
const actionManager = $createActionManager();
export function $getAllActionScopes(): ReadonlyArray<ActionScope> {
    return actionManager.scopes;
}
export function $getActionScope(scopeID: ActionScopeID): Readonly<ActionScope> {
    return actionManager.scopes[scopeID.id];
}


let actionScopeID = 0;
export function $createActionScope(name: string, elementID: string): ActionScopeID {
    assert( !variableExists( actionManager.scopes.find((scope) => scope.name === name) ), `Action Scope already exists: ${name}` );

    const scopeID = { id: actionScopeID++ };
    actionManager.scopes[scopeID.id] = { name, elementID, actions: new Map() };
    return scopeID;
}


export function $createAction<P>( name: string, scope: ActionScopeID, command: Command<P> | undefined, defaultPayload: P, shortcut: Shortcut, label: string ): Action<P> {
    const packedShortcut = $packShortcut( shortcut );
    for ( const s of actionManager.scopes ) {
        assert( packedShortcut == NO_SHORTCUT_PACKED || !s.actions.has(packedShortcut), `Shortcut already exists: ${s.name}: ${s.actions.get(packedShortcut)?.name}` );

        for ( const [, action] of s.actions ) {
            assert( !(action.name === name), `Action already created: ${s.name}:${name}` );
        }

    }

    const action: Action<P> = isDev() ? { name, command, defaultPayload, shortcut, label } : { command, defaultPayload, shortcut, label };
    actionManager.scopes[scope.id].actions.set(packedShortcut, action);

    return action;
}


export function $callAction<P>( action: Action<P>, payload?: P ) {
    if ( action.command )
        $callCommand( action.command, payload || action.defaultPayload );
}

export const GLOBAL_ACTION_SCOPE = $createActionScope("Global", "");