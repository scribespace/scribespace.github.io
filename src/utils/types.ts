import { assert } from "./dev";

export interface ValueUnit {
    value?: number;
    unit: string;
}

export interface Font {
    name: string;
    alt: string;
}

export function fontToStyle(font: Font): string {
    const alt = font.alt != '' ? (', ' + font.alt) : '';
    return font.name + alt;
}
export function fontFromStyle(style: string): Font {
    assert(style.length > 0, "Style empty");
    const fontArray = style.split(', ');
    return {name: fontArray[0], alt: fontArray.slice(1).join(', ')};
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (...args: any[]) => any;

export type IsFunction< F > = F extends Func ? F : never;


export type CreateFunctions<T extends string> = {
    [K in T]: Func
};


export type ObjectInterface = { [key: string]: Func };