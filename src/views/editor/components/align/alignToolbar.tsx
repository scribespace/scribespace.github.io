import { MenuItem, Submenu } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { FORMAT_ELEMENT_CMD, SELECTION_CHANGE_CMD } from "@editor/plugins/commandsPlugin/commands";
import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import {
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  ElementFormatType,
  ElementNode
} from "lexical";
import { useEffect, useMemo, useState } from "react";

export default function AlignToolbar() {
  const [editor] = useLexicalComposerContext();
  const {
    theme: { horizontalContainer },
    theme: { itemSelected },
  } = useToolbarContext();
  const {
    editorTheme: {
      alignTheme: {
        AlignLeftIcon,
        AlignCenterIcon,
        AlignRightIcon,
        AlignJustifyIcon,
      },
    },
  } = useMainThemeContext();
  const [selectedFormat, setSelectedFormat] =
    useState<ElementFormatType>("left");

  const onClickLeft = () => {
    $callCommand(FORMAT_ELEMENT_CMD, "left");
  };

  const onClickCenter = () => {
    $callCommand(FORMAT_ELEMENT_CMD, "center");
  };

  const onClickRight = () => {
    $callCommand(FORMAT_ELEMENT_CMD, "right");
  };

  const onClickJustify = () => {
    $callCommand(FORMAT_ELEMENT_CMD, "justify");
  };

  useEffect(() => {
    if (editor) {
      const updateStates = () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) && !$isNodeSelection(selection))
          return false;

        let sameFormat = true;
        let format: ElementFormatType = "";

        const nodes = selection.getNodes();
        for (const node of nodes) {
          const element = $findMatchingParent(
            node,
            (parentNode): parentNode is ElementNode =>
              $isElementNode(parentNode) && !parentNode.isInline(),
          );
          if (element !== null) {
            if (format == "") format = element.getFormatType();
            else sameFormat = format == element.getFormatType();
          }
        }

        if (sameFormat) {
          setSelectedFormat(format == "" ? "left" : format);
        }
      };

      return mergeRegister(
        $registerCommandListener(
          SELECTION_CHANGE_CMD,
          () => {
            updateStates();
            return false;
          },
        ),
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            updateStates();
          });
        }),
      );
    }
  }, [editor]);

  const AlignSelectedIcon = useMemo(() => {
    switch (selectedFormat) {
      case "center":
        return AlignCenterIcon;
      case "right":
        return AlignRightIcon;
      case "justify":
        return AlignJustifyIcon;
      default:
        return AlignLeftIcon;
    }
  }, [
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    selectedFormat,
  ]);

  return (
    <Submenu className={horizontalContainer}>
      <MenuItem>
        <AlignSelectedIcon />
      </MenuItem>

      <div className={selectedFormat === "left" ? itemSelected : ""}>
        <MenuItem onClick={onClickLeft}>
          <AlignLeftIcon />
        </MenuItem>
      </div>
      <div className={selectedFormat === "center" ? itemSelected : ""}>
        <MenuItem onClick={onClickCenter}>
          <AlignCenterIcon />
        </MenuItem>
      </div>
      <div className={selectedFormat === "right" ? itemSelected : ""}>
        <MenuItem onClick={onClickRight}>
          <AlignRightIcon />
        </MenuItem>
      </div>
      <div className={selectedFormat === "justify" ? itemSelected : ""}>
        <MenuItem onClick={onClickJustify}>
          <AlignJustifyIcon />
        </MenuItem>
      </div>
    </Submenu>
  );
}
