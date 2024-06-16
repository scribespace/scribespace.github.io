export enum SpecialKey {
    None = 0,
    Shift = 1 << 0,
    Ctrl = 1 << 1,
    Meta = 1 << 2,
    Alt = 1 << 3,

    KeyNum = 4,
    AllSet = ((1 << 4) - 1)
}
export interface Shortcut {
    key: string;
    specialKeys: SpecialKey;
}

export const KEY_ENTER = "Enter" as const;
export const KEY_BACKSPACE = "Backspace" as const;
export const KEY_ESCAPE = "Escape" as const;
export const KEY_DELETE = "Delete" as const;
export const KEY_SPACE = " " as const;
export const KEY_LEFT = 'ArrowLeft' as const;
export const KEY_RIGHT = 'ArrowRight' as const;
export const KEY_UP = 'ArrowUp' as const;
export const KEY_DOWN = 'ArrowDown' as const;

export function $packShortcut(shortcut: Shortcut): number {
    return shortcut.key.charCodeAt(0) << SpecialKey.KeyNum | shortcut.specialKeys;
}
export function $unpackShortcut(packed: number): Shortcut {
    const specialKeys = packed & (SpecialKey.AllSet);
    const key = String.fromCharCode((packed >> SpecialKey.KeyNum));
    return { key, specialKeys };
}

export function $shortcutFromKeyboardEvent(event: KeyboardEvent): Shortcut {
    const { key, shiftKey, ctrlKey, metaKey, altKey } = event;
    return {
        key,
        specialKeys: (shiftKey ? SpecialKey.Shift : SpecialKey.None)
            | (ctrlKey ? SpecialKey.Ctrl : SpecialKey.None)
            | (metaKey ? SpecialKey.Meta : SpecialKey.None)
            | (altKey ? SpecialKey.Alt : SpecialKey.None)
    };
}
export function $shortcutToDebugString(shortcut: Shortcut) {
    return shortcut.key
        + (shortcut.specialKeys & SpecialKey.Shift) ? "+ Shift" : ""
        + (shortcut.specialKeys & SpecialKey.Ctrl) ? "+ Ctrl" : ""
        + (shortcut.specialKeys & SpecialKey.Meta) ? "+ Meta" : ""
        + (shortcut.specialKeys & SpecialKey.Alt) ? "+ Alt" : "";
}
export const NO_SHORTCUT: Shortcut = { key: "", specialKeys: SpecialKey.None };
