import { $packShortcut, $shortcutFromKeyboardEvent, $unpackShortcut, CodeToKey, INVALID_SHORTCUT, KEY_SPACE, Shortcut, SpecialKey } from "@systems/shortcutManager/shortcut";
import { describe, expect, test } from "vitest";

describe.concurrent("Shortcuts:",
    () => {
        test("Packing Reversing",
            () => {
                const shortcutsArray: Shortcut[] = [];
                for ( const k of CodeToKey ) {
                    for ( let m = 0; m < (1<<SpecialKey.KeyNum); ++m ) {
                        shortcutsArray.push( {key: k, specialKeys: m} );
                    }
                }

                for ( let m = 0; m < (1<<SpecialKey.KeyNum); ++m ) {
                    shortcutsArray.push( {key: KEY_SPACE, specialKeys: m} );
                }

                for ( let m = 0; m < (1<<SpecialKey.KeyNum); ++m ) {
                    shortcutsArray.push( {key: 'c', specialKeys: m} );
                    shortcutsArray.push( {key: 'a', specialKeys: m} );
                    shortcutsArray.push( {key: '-', specialKeys: m} );
                    shortcutsArray.push( {key: '@', specialKeys: m} );
                    shortcutsArray.push( {key: 'P', specialKeys: m} );
                    shortcutsArray.push( {key: 'A', specialKeys: m} );
                }
                
                for (const s of shortcutsArray ) {
                    expect( $unpackShortcut($packShortcut(s)) ).toEqual(s);
                }
            }
        );

        test("Packing Unsupported",
            () => {
                const shortcutsArray: Shortcut[] = [];
                for ( let m = 0; m < (1<<SpecialKey.KeyNum); ++m ) {
                    shortcutsArray.push( {key: "Ctrl", specialKeys: m} );
                    shortcutsArray.push( {key: "Shift", specialKeys: m} );
                    shortcutsArray.push( {key: "ShIfT", specialKeys: m} );
                }

                for (const s of shortcutsArray ) {
                    expect( $packShortcut(s) ).toEqual(INVALID_SHORTCUT);
                }
            }
        );

        test("KeyboardEvent To Shortcut",
            () => {
                const events = [
                    new KeyboardEvent("keydown", {altKey: true, shiftKey: true, key:'a'}),
                    new KeyboardEvent("keydown", {metaKey: true, shiftKey: true, key:'enter'}),
                    new KeyboardEvent("keydown", {metaKey: true, shiftKey: true, key:'Enter'}),
                    new KeyboardEvent("keydown", {altKey: true, ctrlKey: true, key:'b'}),
                    new KeyboardEvent("keydown", {shiftKey: true, key:'Ctrl'}),
                ];

                const expected: Shortcut[] = [
                    {key: 'a', specialKeys: SpecialKey.Alt | SpecialKey.Shift},
                    {key: 'enter', specialKeys: SpecialKey.Meta | SpecialKey.Shift},
                    {key: 'enter', specialKeys: SpecialKey.Meta | SpecialKey.Shift},
                    {key: 'b', specialKeys: SpecialKey.Alt | SpecialKey.Ctrl},
                    {key: 'ctrl', specialKeys: SpecialKey.Shift},
                ];

                for ( let i = 0; i < events.length; ++i ) {
                    expect( $shortcutFromKeyboardEvent(events[i]) ).toEqual( expected[i] );
                }
            }
        );
    }
);