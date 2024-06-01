import { ObjectInterface } from "@utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WebWorkerResolveGeneric = (...args: any[]) => void;
export type WebWorkerError = ((error: unknown) => void) | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WebWorkerManagerFunctionGeneric = (resolve: WebWorkerResolveGeneric, onerror: WebWorkerError, ...args: any[]) => void;

export type WebWorkerManagerInterface<I extends ObjectInterface> = {
    [N in keyof I]: (resolve: (...args: Awaited<ReturnType<I[N]>>) => void, onerror: WebWorkerError, ...args: Parameters<I[N]>) => void;
};

export interface WebWorkerPayload<ThreadInterface> {
    callbackID: number;
    funcID: keyof ThreadInterface;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
}

export interface WebWorkerResult {
    success: boolean;
    callbackID: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
}

export interface WebWorkerCallback {
    resolve: WebWorkerResolveGeneric;
    onerror: WebWorkerError;
}
