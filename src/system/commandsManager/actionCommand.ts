import { Command } from "./command";
import { Shortcut } from "./shortcut";

export interface Action<P> {
    shortcut: Shortcut;
    defaultPayload?: P;
    description?: string;
}

export class ActionCommand<P> extends Command<P> implements Action<P> {
    readonly shortcut: Shortcut;
    readonly defaultPayload?: P | undefined;
    readonly description?: string | undefined;

    constructor(shortcut: Shortcut, defaultPayload?: P, description?: string, name?: string) {
        super(name);
        this.shortcut = shortcut;
        this.defaultPayload = defaultPayload;
        this.description = description;
    }    
}

