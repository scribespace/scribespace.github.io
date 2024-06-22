const TREE_STATUS_PATH = "tree_status";
const TREE_STATUS_VERSION_PATH = "tree_status/version";
const TREE_STATUS_VERSION = '0' as const;

export function storeTreeStatus(treeStatus: string[]) {
    const treeStatusString = treeStatus.join(';');
    window.localStorage.setItem(TREE_STATUS_PATH, treeStatusString);
    window.localStorage.setItem(TREE_STATUS_VERSION_PATH, TREE_STATUS_VERSION);
}

export function loadTreeStatus(): string[] {
    const treeStatusString = window.localStorage.getItem(TREE_STATUS_PATH);
    if ( treeStatusString )
        return treeStatusString.split(';');

    return [];
}