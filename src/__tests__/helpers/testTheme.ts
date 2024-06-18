import { MainTheme } from "@/theme";
import { SiVitest } from "react-icons/si";

export const TEST_THEME_DEFAULT: MainTheme = {
    editorTheme: {
        editorContainer: "editorContainer_css",
        editorInner: "editorInner_css",
        editorEditable: "editorEditable_css",
        editorInputTheme: {
            defaultFontSize: "defaultFontSize_css",
            defaultFontFamily: {
                name: "font_family",
                alt: "font_alt"
            },
            layout: "layout_css"
        },
        editorSeeThrough: "editorSeeThrough_css",
        editorPrintDisabled: "editorPrintDisabled_css",
        tableLayoutTheme: {
            menuTheme: {
                TableAddIcon: SiVitest,
                LayoutAddIcon: SiVitest,
                DeleteIcon: SiVitest,
                MergeCellIcon: SiVitest,
                SplitCellIcon: SiVitest,
                RowAddBeforeIcon: SiVitest,
                RowAddAfterIcon: SiVitest,
                ColumnAddBeforeIcon: SiVitest,
                ColumnAddAfterIcon: SiVitest,
                RowRemoveIcon: SiVitest,
                ColumnRemoveIcon: SiVitest,
            },
            tableTheme: {
                creatorTheme: {
                    container: "table_creator_container",
                    cellContainer: "table_creator_cell_container",
                    cell: "table_creator_cell",
                    label: "table_creator_label"
                }
            },
            layoutTheme: {},
        },
        separatorTheme: {
            separatorHorizontal: "separatorHorizontal_css",
            separatorHorizontalStrong: "separatorHorizontalStrong_css",
            separatorVertical: "separatorVertical_css",
            separatorVerticalStrong: "separatorVerticalStrong_css"
        },
        linkTheme: {
            editor: "link_editor_css",
            container: "link_container_css",
            icon: "link_icon_css",
            input: "link_input_css",
            button: "link_button_css",
            TextIcon: SiVitest,
            LinkIcon: SiVitest,
            OpenIcon: SiVitest,
        },
        numberInputTheme: {
            container: "numberInput_container_css",
            controlButton: "numberInput_controlButton_css",
            acceptButton: "numberInput_acceptButton_css",
            input: "numberInput_input_css",
            IncreaseIcon: SiVitest,
            DecreaseIcon: SiVitest,
            AcceptIcon: SiVitest
        },
        undoRedoTheme: {
            UndoIcon: SiVitest,
            RedoIcon: SiVitest
        },
        fontStyleTheme: {
            BoldIcon: SiVitest,
            ItalicIcon: SiVitest,
            UnderlineIcon: SiVitest,
            StrikethroughIcon: SiVitest,
            ClearFormattingIcon: SiVitest
        },
        alignTheme: {
            AlignLeftIcon: SiVitest,
            AlignCenterIcon: SiVitest,
            AlignRightIcon: SiVitest,
            AlignJustifyIcon: SiVitest
        },
        colorTheme: {
            colorPickerContainer: "colorPickerContainer_css",
            ColorTextIcon: SiVitest,
            ColorBackgroundIcon: SiVitest
        },
        imageTheme: {
            element: "image_element_css",
            selected: "image_selected_css",
            control: {
                anchorSize: 0,
                anchor: "image_control_anchor",
                marker: "image_control_marker"
            }
        },
        listTheme: {
            ListNumberIcon: SiVitest,
            ListBulletIcon: SiVitest
        },
        horizontalBreakTheme: {
            HorizontalBreakIcon: SiVitest
        },
        pageBreakTheme: {
            pageBreakFiller: "pageBreakFiller_css",
            PageBreakIcon: SiVitest
        },
        toolbarTheme: {
            container: "toolbar_container_css",
            menuTheme: {
                fontFamily: "toolbar_menu_fontFamily_css",
                horizontalContainer: "toolbar_menu_horizontalContainer_css",
                containerDefault: "toolbar_menu_containerDefault_css",
                itemDefault: "toolbar_menu_itemDefault_css",
                itemSelected: "toolbar_menu_itemSelected_css",
                itemDisabled: "toolbar_menu_itemDisabled_css",
                itemIcon: "toolbar_menu_itemIcon_css",
                submenuIcon: "toolbar_menu_submenuIcon_css",
                itemIconSize: "toolbar_menu_itemIconSize_css",
                SubmenuIcon: SiVitest
            }
        },
        contextMenuTheme: {
            menuTheme: {
                editorContainer: "context_menu_editorContainer_css",
                menuLabel: "context_menu_menuLabel_css",
                containerDefault: "context_menu_containerDefault_css",
                itemDefault: "context_menu_itemDefault_css",
                itemSelected: "context_menu_itemSelected_css",
                itemDisabled: "context_menu_itemDisabled_css",
                itemIcon: "context_menu_itemIcon_css",
                submenuIcon: "context_menu_submenuIcon_css",
                itemIconSize: "context_menu_itemIconSize_css",
                SubmenuIcon: SiVitest
            }
        }
    },
    treeTheme: {
        AddIcon: SiVitest,
        DeleteIcon: SiVitest
    },
    commonTheme: {
        pulsing: "pulsing_css"
    },
  };
  