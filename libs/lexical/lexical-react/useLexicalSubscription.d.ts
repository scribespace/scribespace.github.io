/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { LexicalEditor } from 'lexical';
export type LexicalSubscription<T> = {
    initialValueFn: () => T;
    subscribe: (callback: (value: T) => void) => () => void;
};
/**
 * Shortcut to Lexical subscriptions when values are used for render.
 */
export declare function useLexicalSubscription<T>(subscription: (editor: LexicalEditor) => LexicalSubscription<T>): T;
/** @deprecated use the named export {@link useLexicalSubscription} */
export default useLexicalSubscription;
