import { useEffect, useState } from "react";
import useTraceUpdate from "../useTraceUpdate";
import { variableExists } from "@/utils";

export interface WebWorkerResult<T> {
    result: T;
    terminate?: boolean;
}

export default function useWebWorker<T>( func: (args: unknown) => WebWorkerResult<T>|Promise<WebWorkerResult<T>>, args: unknown, initialValue: T ) {
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
        [args, func]
    );

    useTraceUpdate({func, args});

    return result;
}