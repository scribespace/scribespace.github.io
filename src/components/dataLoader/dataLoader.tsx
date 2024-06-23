import { notesManager } from "@systems/notesManager";
import { treeManager } from "@systems/treeManager";
import { useRef, useEffect, useState } from "react";

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
          const managersPromises = [treeManager.loadTreeData(), notesManager.initNotes()];
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