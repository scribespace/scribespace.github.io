import { Font } from "./types";

import { assert } from "./dev";


export function fontToStyle(font: Font): string {
    const alt = font.alt != '' ? (', ' + font.alt) : '';
    return font.name + alt;
}
export function fontFromStyle(style: string): Font {
    assert(style.length > 0, "Style empty");
    const fontArray = style.split(', ');
    return { name: fontArray[0], alt: fontArray.slice(1).join(', ') };
}
