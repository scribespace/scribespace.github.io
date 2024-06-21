import { DEV } from "@systems/environment";
import { Func } from "@utils";

export type CommandListener<P> = (payload: P) => unknown;
export type CommandCaller<P> = (payload: P, listeners: CommandListener<P>[]) => void;
export class Command<P> {
    private __name: string | undefined = undefined;
    get name() { return this.__name; }

    callCommand(payload: P, listeners: CommandListener<P>[]) {
        for (const listener of listeners) {
            listener(payload);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerExternalCommandListener(_listener: CommandListener<P>): null | Func {
        return null;
    }

    constructor( name?: string) {
        DEV( () => {   
            this.__name = name;
        });
    }
}
