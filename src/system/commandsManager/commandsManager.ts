import { Func, assert } from "@utils";
import { Command, CommandListener } from "./command";
import { isDev } from "@systems/environment/environment";

const commandMap = new Map<Command<unknown>, CommandListener<unknown>[]>();

export function $createCommand<P>(name:string) : Command<P> {
    return isDev() ? new Command<P>(name) : new Command<P>();
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