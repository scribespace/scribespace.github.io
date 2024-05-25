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