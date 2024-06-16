import { Func, assert, isDev } from "@utils";
import { Shortcut } from "./shortcut";

export type CommandListener<P> = (payload: P) => unknown;
export type CommandCaller<P> = (payload: P, listeners: CommandListener<P>[]) => void;
export class Command<P> {
    private __name: string | undefined;
    get name() { return this.__name; }

    private __shortcut: Shortcut;
    get shortcut() {return this.__shortcut;}

    private __defaultPayload?: P;
    get defaultPayload() { return this.__defaultPayload; }

    callCommand(payload: P, listeners: CommandListener<P>[]) {
        for ( const listener of listeners ) {
            listener(payload);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerExternalCommandListener( _listener: CommandListener<P> ): null | Func {
        return null;
    }

    constructor( shortcut: Shortcut, defaultPayload?: P, name?: string) {
        this.__shortcut = shortcut;
        this.__defaultPayload = defaultPayload;
        this.__name = name;
    }
}

const commandMap = new Map<Command<unknown>, CommandListener<unknown>[]>();

export function $registerCommand<P>(shortcut: Shortcut, defaultPayload: P | undefined, name:string) : Command<P> {
    return isDev() ? new Command<P>(shortcut, defaultPayload, name) : new Command<P>(shortcut, defaultPayload);
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
