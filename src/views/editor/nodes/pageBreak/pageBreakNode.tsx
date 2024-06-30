/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { PageBreak } from '@editor/components/pageBreak/pageBreak';

import {
  COMMAND_PRIORITY_HIGH,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  LexicalNode,
  SerializedLexicalNode
} from 'lexical';

export type SerializedPageBreakNode = SerializedLexicalNode;

export class PageBreakNode extends DecoratorNode<JSX.Element> {
  static getType(): string {
    return 'page-break';
  }

  static clone(node: PageBreakNode): PageBreakNode {
    return new PageBreakNode(node.__key);
  }

  static importJSON(): PageBreakNode {
    return $createPageBreakNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figure: (domNode: HTMLElement) => {
        const tp = domNode.getAttribute('type');
        if (tp !== this.getType()) {
          return null;
        }

        return {
          conversion: $convertPageBreakElement,
          priority: COMMAND_PRIORITY_HIGH,
        };
      },
    };
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: this.getType(),
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const el = document.createElement('figure');
    el.style.pageBreakAfter = 'always';
    el.setAttribute('type', this.getType());
    return el;
  }

  getTextContent(): string {
    return '\n';
  }

  isInline(): false {
    return false;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <PageBreak nodeKey={this.__key} />;
  }
}

function $convertPageBreakElement(): DOMConversionOutput {
  return {node: $createPageBreakNode()};
}

export function $createPageBreakNode(): PageBreakNode {
  return new PageBreakNode();
}

export function $isPageBreakNode(
  node: LexicalNode | null | undefined,
): node is PageBreakNode {
  return node instanceof PageBreakNode;
}
