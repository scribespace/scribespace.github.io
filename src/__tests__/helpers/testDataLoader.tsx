import { TEST_THEME_DEFAULT } from "@/__tests__/helpers/testTheme";
import { Actions } from "@/components/actions/actions";
import { DataLoader } from "@/components/dataLoader/dataLoader";
import { MainThemeContext } from "@/mainThemeContext";
import TreeView from "@tree/treeView";

export const DefaultTestDataLoader = 
() => {
    return (
        <DataLoader>
            <MainThemeContext.Provider value={TEST_THEME_DEFAULT}>
                <Actions />
                <TreeView setSelectedFile={() => {}}/>
            </MainThemeContext.Provider>
        </DataLoader>
    );
};