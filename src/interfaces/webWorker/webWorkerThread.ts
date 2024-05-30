import { isFunctionOrThrowDev } from "@/utils/common";
import { WebWorkerPayload, WebWorkerResult } from "./webWorkerShared";

export class WebWorkerThread<ThreadInterface> {
    threadFunctions: ThreadInterface;
    constructor(functoins: ThreadInterface) {
        this.threadFunctions = functoins;

        self.onmessage = (event) => {
            const payload: WebWorkerPayload<ThreadInterface> = event.data; 
            this.callFunction( payload );
        };
    }

    protected async callFunction( payload: WebWorkerPayload<ThreadInterface> ) {
        try {
            const func = this.threadFunctions[payload.funcID]; 
            isFunctionOrThrowDev(func);

            const result = await func(...payload.args);
            self.postMessage( {success: true, callbackID: payload.callbackID, args: result} as WebWorkerResult );
        } catch ( error ) {
            self.postMessage( {success: false, callbackID: payload.callbackID, args: [error]} as WebWorkerResult );
        }
    }
}