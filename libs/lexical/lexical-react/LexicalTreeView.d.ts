/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import type { LexicalEditor } from 'lexical';
import { CustomPrintNodeFn } from '@lexical/devtools-core';
export declare function TreeView({ treeTypeButtonClassName, timeTravelButtonClassName, timeTravelPanelSliderClassName, timeTravelPanelButtonClassName, viewClassName, timeTravelPanelClassName, editor, customPrintNode, }: {
    editor: LexicalEditor;
    treeTypeButtonClassName: string;
    timeTravelButtonClassName: string;
    timeTravelPanelButtonClassName: string;
    timeTravelPanelClassName: string;
    timeTravelPanelSliderClassName: string;
    viewClassName: string;
    customPrintNode?: CustomPrintNodeFn;
}): JSX.Element;
