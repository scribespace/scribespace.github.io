import { useMainThemeContext } from "@/mainThemeContext";
import { $createLayoutNodeWithColumns } from "@/views/editor/nodes/layout";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { MenuItem, Submenu } from "../../menu";
import SubmenuIcon from "../../menu/submenuIcon";
import { NumberInputContextMenu } from "./numberInputContextMenu";

export function LayoutCreateContextMenu() {
    const [editor] = useLexicalComposerContext();
    const {editorTheme: {tableLayoutTheme: {menuTheme: {LayoutAddIcon}}}} = useMainThemeContext();

    const onInputAccepted = (input: HTMLInputElement) => {
        const cols = input.valueAsNumber;

        editor.update(() => {
            const layoutNode = $createLayoutNodeWithColumns(cols);
            $insertNodes([layoutNode]);
        });

        $closeContextMenu(editor);
    };

    return (
        <Submenu className="">
            <MenuItem>
                <LayoutAddIcon/>
                <div>Create Layout</div>
                <SubmenuIcon/>
            </MenuItem>
            <NumberInputContextMenu value={2} min={2} onInputAccepted={onInputAccepted} />
        </Submenu>
    );
}