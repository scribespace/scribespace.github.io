import TreeView from "./tree/treeView";

import "./css/mainView.css";

import { ShortcutsDialog } from "@/components/shortcuts/shortcutsDialog";
import useBoundingRect from "@/hooks/useBoundingRect";
import { EditorView } from "@/views/editor/editorView";
import { useEffect, useRef, useState } from "react";
import { AUTH_DISABLED, authGlobal } from "../system/authentication";
import { Actions } from "@/components/actions/actions";
import { treeManager } from "@systems/treeManager";
import { notesManager } from "@systems/notesManager";

type Props = {
  changeAuthButtonState: (state: number) => void;
};

export function MainView({changeAuthButtonState}: Props) {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { height: toolbarHeight } = useBoundingRect(toolbarRef);

  const runOnceRef = useRef<boolean>(true);

  useEffect(
    () => {
      if ( runOnceRef.current ) {
        runOnceRef.current = false;
        const managersPromises = [treeManager.loadTreeData(), notesManager.initNotes()];
        Promise.all(managersPromises).then( () => {setIsLoading(false);});
      }
    },
    []
  );

  const handleLogOutClick = () => {
    authGlobal.logout().then(() => {
      changeAuthButtonState(AUTH_DISABLED);
    });
  };

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
          {!isLoading &&
          <>
            <TreeView setSelectedFile={setSelectedFile} />
            <EditorView selectedFile={selectedFile} />
          </>}
        </div>
      </div>
      <ShortcutsDialog/>
    </>
  );
}
