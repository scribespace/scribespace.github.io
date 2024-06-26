/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { LexicalEditor } from 'lexical';
export default function positionNodeOnRange(editor: LexicalEditor, range: Range, onReposition: (node: Array<HTMLElement>) => void): () => void;
