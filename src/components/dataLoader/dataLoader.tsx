import { $getNotesManager } from "@systems/notesManager";
import { $getTreeManager } from "@systems/treeManager";
import { useEffect, useRef, useState } from "react";

interface DataLoaderProp {
    children: React.ReactNode
}

export function DataLoader({children}: DataLoaderProp) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const runOnceRef = useRef<boolean>(true);

    useEffect(
      () => {
        if ( runOnceRef.current ) {
          runOnceRef.current = false;
          const managersPromises = [$getTreeManager().loadTreeData(), $getNotesManager().initNotes()];
          Promise.all(managersPromises).then( () => {setIsLoading(false);});
        }
      },
      []
    );

    return (
        <>
        {!isLoading && children}
        </>
    );
}