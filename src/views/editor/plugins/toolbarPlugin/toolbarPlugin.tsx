import { MenuRoot } from "@/components/menu";
import { SeparatorVertical } from "@/components/separators";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import FontStyleToolbar from "@/views/editor/components/fontStyle/fontStyleToolbar";
import UndoRedoToolbar from "@/views/editor/components/undoRedo/undoRedoToolbar";
import { forwardRef, useEffect, useState } from "react";
import AlignToolbar from "../../components/align/alignToolbar";
import {
  ColorBackgroundToolbar,
  ColorTextToolbar,
} from "../../components/color";
import FontFamilyToolbar from "../../components/fontFamily/fontFamilyToolbar";
import FontSizeToolbar from "../../components/fontSize/fontSizeToolbar";
import { LinkToolbar } from "../../components/link";
import { LayoutCreateToolbar } from "../../components/tableLayout/layout";
import { TableCreateToolbar } from "../../components/tableLayout/table/toolbar/tableCreateToolbar";
import { TOOLBAR_CONTEX_DEFAULT, ToolbarContextData } from "./context";
import "./css/toolbarPlugin.css";
import { ListToolbar } from "../../components/list/listToolbar";
import { HorizontalBreakToolbar } from "@editor/components/horizontalBreak/horizontalBreakToolbar";
import { PageBreakToolbar } from "@editor/components/pageBreak/pageBreakToolbar";

const ToolbarPlugin = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    editorTheme: { toolbarTheme },
  }: MainTheme = useMainThemeContext();

  const [toolbarContext, setToolbarContext] = useState<ToolbarContextData>(
    TOOLBAR_CONTEX_DEFAULT,
  );

  useEffect(() => {
    setToolbarContext((oldState) => ({
      ...oldState,
      theme: toolbarTheme.menuTheme,
    }));
  }, [toolbarTheme.menuTheme]);

  return (
    <MenuRoot value={toolbarContext}>
      <div ref={ref} className={toolbarTheme.container}>
        <UndoRedoToolbar />
        <SeparatorVertical />
        <FontStyleToolbar />
        <SeparatorVertical />
        <FontSizeToolbar />
        <FontFamilyToolbar />
        <SeparatorVertical />
        <AlignToolbar />
        <SeparatorVertical />
        <ColorTextToolbar />
        <ColorBackgroundToolbar />
        <SeparatorVertical />
        <LinkToolbar />
        <SeparatorVertical />
        <LayoutCreateToolbar />
        <TableCreateToolbar />
        <SeparatorVertical />
        <ListToolbar />
        <SeparatorVertical />
        <HorizontalBreakToolbar />
        <PageBreakToolbar />
      </div>
    </MenuRoot>
  );
});

export default ToolbarPlugin;
