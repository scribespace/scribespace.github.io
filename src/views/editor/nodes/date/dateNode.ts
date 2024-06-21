import { $applyNodeReplacement, EditorConfig, IS_TOKEN, LexicalEditor, LexicalNode, NodeKey, SerializedTextNode, TextNode, getActiveEditor } from "lexical";
import { DateTheme } from "./theme/dateTheme";
import { addClassNamesToElement } from "@lexical/utils";

export class DateNode extends TextNode {
  __dateTheme: DateTheme;
    constructor(text?: string, key?: NodeKey) {
        const dayMap = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        const date = new Date();
        const dateString = `(${dayMap[date.getDay()]}) ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;

        super(text || dateString, key);
        this.__dateTheme = getActiveEditor()._config.theme.date;
        this.__style = this.__dateTheme.style;
        this.__format = this.__dateTheme.format;
        this.__mode = IS_TOKEN;
      }

      isUnmergeable() {
        return true;
      }

      static getType(): string {
        return 'date';
      }

      static clone(node: DateNode): DateNode {
        return new DateNode(node.__text, node.__key);
      }

      createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
        const dom = super.createDOM(config, editor);
        const outerTag = document.createElement('p');
        addClassNamesToElement(outerTag, this.__dateTheme.outerTagTheme);

        outerTag.append(dom);
        return outerTag;
      }

      exportJSON() {
        return {
            ...super.exportJSON(),
            type: DateNode.getType(),
            version: 1,
        };
      }
  
      static importJSON(serializedNode: SerializedTextNode): DateNode {
        const node = $createDateNode(serializedNode.text);
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
      }
}

export function $createDateNode(
    text?: string
  ): DateNode {
    return $applyNodeReplacement(new DateNode(text));
  }
  
  export function $isDateNode(
    node: LexicalNode | null | undefined,
  ): node is DateNode {
    return node instanceof DateNode;
  }
  