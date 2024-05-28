import { variableExists } from "@/utils";
import { DependencyList, useEffect, useState } from "react";

export interface WebWorkerResult<T> {
    result: T;
    terminate?: boolean;
}

export default function useWebWorker<T>( func: (args: unknown) => WebWorkerResult<T>|Promise<WebWorkerResult<T>>, args: unknown, initialValue: T, deps?: DependencyList ) {
    const [result, setResult] = useState<T>(initialValue);

    useEffect(
        () => {
            const webWorker = new Worker(new URL('./worker.js', import.meta.url));
            webWorker.onmessage = function (event) {
                const {result, terminate} = event.data as WebWorkerResult<T>;
                setResult(result);
                if ( !variableExists(terminate) || terminate )
                    webWorker.terminate();
              };

            webWorker.postMessage({func: func.toString(), arg: args});

            return () => webWorker.terminate();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [func, args, ...(deps || [])]
    );

    return result;
}