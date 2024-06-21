import { DEV, ENV, OS } from "@systems/environment";
import { assert, variableExists } from "@utils";

export enum SpecialKey {
    None = 0,
    Shift = 1 << 0,
    Ctrl = 1 << 1,
    Meta = 1 << 2,
    Alt = 1 << 3,

    KeyNum = 4,
    AllSet = ((1 << 4) - 1)
}
export class Shortcut {
    key: string;
    specialKeys: SpecialKey;

    constructor( key: string, specialKeys: SpecialKey, specialKeysMac?: SpecialKey ) {
        this.key = key;
        this.specialKeys = specialKeys;
        if( ENV.OS == OS.Mac ) {
            this.specialKeys = specialKeysMac || specialKeys;
        }
    }
}

export const KEY_ENTER = "enter" as const;
export const KEY_BACKSPACE = "backspace" as const;
export const KEY_ESCAPE = "escape" as const;
export const KEY_DELETE = "delete" as const;
export const KEY_LEFT = 'arrowLeft' as const;
export const KEY_RIGHT = 'arrowRight' as const;
export const KEY_UP = 'arrowUp' as const;
export const KEY_DOWN = 'arrowDown' as const;
export const KEY_SHIFT = 'shift' as const;
export const KEY_TAB = 'tab' as const;
export const KEY_SPACE = " " as const;

export const KeyToCode: Record<string, number> = {
    enter: 0,
    backspace: 1,
    escape: 2,
    delete: 3,
    arrowLeft: 4,
    arrowRight: 5,
    arrowUp: 6,
    arrowDown: 7,
    tab: 8,
};

export const CodeToKey: string[] = [
    KEY_ENTER,
    KEY_BACKSPACE,
    KEY_ESCAPE,
    KEY_DELETE,
    KEY_LEFT,
    KEY_RIGHT,
    KEY_UP,
    KEY_DOWN,
    KEY_TAB,
];

export const INVALID_SHORTCUT = 0;
export type PackedShortcut = number;
export function $packShortcut(shortcut: Shortcut): PackedShortcut {
    const supportKey = CodeToKey.includes(shortcut.key) || shortcut.key.length == 1;
    if ( !supportKey )
        return INVALID_SHORTCUT;

    const keyCode = variableExists(KeyToCode[shortcut.key]) ? KeyToCode[shortcut.key] : shortcut.key.charCodeAt(0);
    const packed = ( keyCode << SpecialKey.KeyNum) | shortcut.specialKeys;

    DEV(
        () => {
            const unpacked = $unpackShortcut(packed);
            assert( unpacked.key == shortcut.key && unpacked.specialKeys == shortcut.specialKeys, `Packed (${packed}) and unpacked keys don't match: ${$shortcutToDebugString(shortcut)} vs ${$shortcutToDebugString(unpacked)}` );
        }
    );

    return packed;
}
export function $unpackShortcut(packed: PackedShortcut): Shortcut {
    const specialKeys = packed & (SpecialKey.AllSet);
    const keyCode = packed >> SpecialKey.KeyNum;
    const key = keyCode >= CodeToKey.length ? String.fromCharCode(keyCode) : CodeToKey[keyCode];
    return { key, specialKeys };
}

export function $shortcutFromKeyboardEvent(event: KeyboardEvent): Shortcut {
    const { key, shiftKey, ctrlKey, metaKey, altKey } = event;
    const specialKeys = (shiftKey ? SpecialKey.Shift : SpecialKey.None)
    | (ctrlKey ? SpecialKey.Ctrl : SpecialKey.None)
    | (metaKey ? SpecialKey.Meta : SpecialKey.None)
    | (altKey ? SpecialKey.Alt : SpecialKey.None);
    return {
        key: key.toLowerCase(),
        specialKeys: specialKeys,
    };
}
export function $shortcutToDebugString(shortcut: Shortcut) {
    return "'" + shortcut.key + "'"
        + ((shortcut.specialKeys & SpecialKey.Shift) ? " + Shift" : "")
        + ((shortcut.specialKeys & SpecialKey.Ctrl) ? " + Ctrl" : "")
        + ((shortcut.specialKeys & SpecialKey.Meta) ? " + Meta" : "")
        + ((shortcut.specialKeys & SpecialKey.Alt) ? " + Alt" : "");
}

export function $shortcutToString(shortcut: Shortcut) {
    let shortcutStr = shortcut.key.charAt(0).toUpperCase() + shortcut.key.slice(1);
    shortcutStr += (shortcut.specialKeys & SpecialKey.Meta) ? (ENV.OS == OS.Mac ? '&#x2318;' : " + Ctrl") : "";
    shortcutStr += (shortcut.specialKeys & SpecialKey.Ctrl) ? " + Ctrl" : "";
    shortcutStr += (shortcut.specialKeys & SpecialKey.Alt) ? " + Alt" : "";
    shortcutStr += (shortcut.specialKeys & SpecialKey.Shift) ? " + Shift" : "";

    return shortcutStr;
}

export const NO_SHORTCUT: Shortcut = { key: "", specialKeys: SpecialKey.None };
export const NO_SHORTCUT_PACKED = $packShortcut(NO_SHORTCUT);
