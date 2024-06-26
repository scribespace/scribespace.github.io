/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Transformer } from '@lexical/markdown';
import { ElementNode } from 'lexical';
/**
 * Renders markdown from a string. The selection is moved to the start after the operation.
 */
export declare function createMarkdownImport(transformers: Array<Transformer>, shouldPreserveNewLines?: boolean): (markdownString: string, node?: ElementNode) => void;
