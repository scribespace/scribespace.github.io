const TREE_STATUS_VERSION = '0' as const;

export interface SerializedTreeStatus {
    version: string;
    nodes: string[];
}

export class TreeStatus {
    private __status: Set<string> = new Set();

    import( serilizedStatus: string ) {
        const status = JSON.parse(serilizedStatus) as SerializedTreeStatus;
        for ( const nodeID of status.nodes ) {
            this.__status.add(nodeID);
        }
    }

    export(): SerializedTreeStatus {
        return {
            version: TREE_STATUS_VERSION,
            nodes: Array.from( this.__status ),
        };
    }

    open(treeNodeID: string) {
        this.__status.delete(treeNodeID);
    }

    close(treeNodeID: string) {
        this.__status.add(treeNodeID);
    }

    toggle(treeNodeID: string ) {
        if ( this.__status.has(treeNodeID) ) {
            this.open(treeNodeID);
        } else {
            this.close(treeNodeID);
        }
    }

    getClosedNodes() {
        return Array.from(this.__status);
    }
}