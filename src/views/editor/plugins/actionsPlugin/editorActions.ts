import { EDITOR_ELEMENT_ID } from "@systems/editorManager/editorConst";
import { $createActionScope } from "@systems/shortcutManager/action";

export const EDITOR_ACTION_SCOPE = $createActionScope("Editor", EDITOR_ELEMENT_ID);

