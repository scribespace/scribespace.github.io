import TreeView from "../tree/treeView";

import "./css/mainView.css";

import { Actions } from "@/components/actions/actions";
import { DataLoader } from "@/components/dataLoader/dataLoader";
import { NotesConvertDialog } from "@/components/notesConvertDialog/notesConvertDialog";
import { ShortcutsDialog } from "@/components/shortcuts/shortcutsDialog";
import useBoundingRect from "@/hooks/useBoundingRect";
import { EditorView } from "@/views/editor/editorView";
import { useEffect, useRef, useState } from "react";
import { AUTH_DISABLED, authGlobal } from "../../system/authentication";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { TREE_RELOAD_CMD } from "@systems/treeManager";

type Props = {
  changeAuthButtonState: (state: number) => void;
};

export function MainView({changeAuthButtonState}: Props) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { height: toolbarHeight } = useBoundingRect(toolbarRef);
  const [treeKey, setTreeKey] = useState(0);

  const handleLogOutClick = () => {
    authGlobal.logout().then(() => {
      changeAuthButtonState(AUTH_DISABLED);
    });
  };

  useEffect(
    () => {
      return $registerCommandListener(
        TREE_RELOAD_CMD,
        () => {
          setTreeKey( (current) => ++current );
        }
      );
    },
    []
  );

  return (
    <>
      <Actions/>
      <div style={{ height: "100%" }}>
        <div ref={toolbarRef} className="toolbox-view">
          <span>
            <button type="button" onClick={handleLogOutClick}>
              Log out
            </button>
          </span>
        </div>
        <div style={{ height: `calc(100% - ${toolbarHeight}px)` }} className="main-view">
          <DataLoader>
            <TreeView key={treeKey}/>
            <EditorView/>
          </DataLoader>
        </div>
      </div>
      <ShortcutsDialog/>
      <NotesConvertDialog/>
    </>
  );
}
