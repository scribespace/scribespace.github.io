import { Func, assert, isDev } from "@utils";
import { Shortcut } from "./shortcut";
import { Command, CommandListener } from "./command";
import { ActionCommand } from "./actionCommand";

const commandMap = new Map<Command<unknown>, CommandListener<unknown>[]>();

export function $registerCommand<P>(name:string) : Command<P> {
    return isDev() ? new Command<P>(name) : new Command<P>();
}

export function $registerActionCommand<P>(name:string, shortcut: Shortcut, defaultPayload?: P, description?: string) : Command<P> {
    return isDev() ? new ActionCommand<P>(shortcut, defaultPayload, description, name) : new ActionCommand<P>(shortcut, defaultPayload, description);
}

export function $registerCommandListener<P>( command: Command<P>, listener: CommandListener<P> ): Func {
    if ( !commandMap.has(command as Command<unknown>) ) {
        commandMap.set(command as Command<unknown>, []);
    }

    const listeners = commandMap.get(command as Command<unknown>) as CommandListener<P>[];
    assert( !listeners.includes(listener), `Listener already registered in command: ${command.name}` );

    const externalCommand = command.registerExternalCommandListener(listener);
    if ( externalCommand ) 
        return externalCommand;

    listeners.push(listener);

    return () => {
        const listenerIndex = listeners.indexOf(listener);
        assert(listenerIndex > -1, `Listener already removed`);
        const lastElement = listeners.pop() as CommandListener<P>;
        if ( listenerIndex < listeners.length ) {
            listeners[listenerIndex] = lastElement;
        }
    };
}

export function $callCommand<P>(cmd: Command<P>, payload: P) {
    const listeners = commandMap.get(cmd as Command<unknown>);
    cmd.callCommand( payload, listeners || [] );
}
