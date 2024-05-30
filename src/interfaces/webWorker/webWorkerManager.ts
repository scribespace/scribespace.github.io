import { variableExistsOrThrowDev } from "@/utils";
import { isKeyOrThrowDev } from "@/utils/common";
import { ObjectInterface } from "@/utils/types";
import { WebWorkerCallback, WebWorkerError, WebWorkerManagerFunctionGeneric, WebWorkerPayload, WebWorkerResolveGeneric, WebWorkerResult } from "./webWorkerShared";

export class WebWorkerManager<ThreadInterface extends ObjectInterface> {    
    protected __webWorker: Worker;

    protected __callbacksMap: Map<number, WebWorkerCallback> = new Map();
    protected __callbacksID: number = 0;

    constructor( webWorker: string | URL, webWorkerFunctions: ThreadInterface, name?: string) {
        const webWorkerName = name || this.constructor.name;

        this.__webWorker = new Worker(webWorker, {name: webWorkerName, type: 'module'});
        this.__webWorker.onmessage = (event) => this.processResult(event);

        for ( const key of Object.getOwnPropertyNames( webWorkerFunctions ) ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this[key as keyof this] as WebWorkerManagerFunctionGeneric) = (resolve: WebWorkerResolveGeneric, onerror: WebWorkerError, ...args: any[]) => {
                this.callFunction( key as keyof ThreadInterface, args, resolve, onerror );
            };
        }
    }

    protected addCallback( callback: WebWorkerCallback ): number {
        const callbackID = this.__callbacksID;
        this.__callbacksMap.set(callbackID, callback);
        this.__callbacksID += 1;

        return callbackID;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected processCallback(callbackID: number, ...args: any[]) {
        const callback = this.__callbacksMap.get(callbackID);
        variableExistsOrThrowDev(callback, `Missing callback ${callbackID}`);
        callback.resolve(args);

        this.__callbacksMap.delete(callbackID);
    }

    protected throwError( callbackID: number, error: unknown ) {
        const callback = this.__callbacksMap.get(callbackID);
        variableExistsOrThrowDev(callback, `Missing callback ${callbackID}`);
        if ( callback.onerror )
            callback.onerror(error);
        else 
            throw Error( `Unhandled error: ${error}` );

        this.__callbacksMap.delete(callbackID);
    }

    terminate() {
        this.__webWorker.terminate();
    }

    /**
     * Don't call it directly. Make wrapers for each function to test args types and avoid using IDs
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected callFunction( funcID: keyof ThreadInterface, args: any[], resolve: WebWorkerResolveGeneric, onerror: WebWorkerError ) {
        isKeyOrThrowDev(funcID, this);
        const callback: WebWorkerCallback = {resolve, onerror};
        const callbackID = this.addCallback(callback);

        const payload: WebWorkerPayload<ThreadInterface> = { callbackID, funcID, args };
        this.__webWorker.postMessage( payload );
    }

    protected processResult( event: MessageEvent ) {
        const result = event.data as WebWorkerResult;
        if ( result.success ) {
            this.processCallback(result.callbackID, result.args);
        } else {
            this.throwError(result.callbackID, result.args);
        }
    }
}