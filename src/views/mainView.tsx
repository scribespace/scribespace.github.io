import TreeView from "./tree/treeView";

import "./css/mainView.css";

import { ShortcutsDialog } from "@/components/shortcuts/shortcutsDialog";
import useBoundingRect from "@/hooks/useBoundingRect";
import { EditorView } from "@/views/editor/editorView";
import { useRef, useState } from "react";
import { AUTH_DISABLED, authGlobal } from "../system/authentication";
import { Actions } from "@/components/actions/actions";

type Props = {
  changeAuthButtonState: (state: number) => void;
};

export function MainView({changeAuthButtonState}: Props) {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { height: toolbarHeight } = useBoundingRect(toolbarRef);

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
        <div
          style={{ height: `calc(100% - ${toolbarHeight}px)` }}
          className="main-view"
        >
          <div className="tree-view">
            <TreeView setSelectedFile={setSelectedFile} />
          </div>
            <EditorView selectedFile={selectedFile} />
        </div>
      </div>
      <ShortcutsDialog/>
    </>
  );
}
