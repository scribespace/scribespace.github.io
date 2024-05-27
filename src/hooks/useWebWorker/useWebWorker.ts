import { useEffect, useState } from "react";
import useTraceUpdate from "../useTraceUpdate";


export default function useWebWorker<T>( func: (args: unknown) => T|Promise<T>, args: unknown, initialValue: T ) {
    const [result, setResult] = useState<T>(initialValue);

    useEffect(
        () => {
            const webWorker = new Worker(new URL('./worker.js', import.meta.url));

            webWorker.onmessage = function (event) {
                setResult(event.data);
                //webWorker.terminate();
              };

            webWorker.postMessage({func: func.toString(), arg: args});

            //return () => webWorker.terminate();
        },
        [args, func]
    );

    useTraceUpdate({func, args});

    return result;
}