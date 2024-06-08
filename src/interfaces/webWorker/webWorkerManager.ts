import {
  isKeyOrThrowDev,
  variableExistsOrThrowDev
} from "@utils";
import {
  WebWorkerCallback,
  WebWorkerError,
  WebWorkerManagerFunctionGeneric,
  WebWorkerManagerInterfaceCreateMapping,
  WebWorkerPayload,
  WebWorkerResolveGeneric,
  WebWorkerResult
} from "./webWorkerShared";

export class WebWorkerManager<WebWorkerFunctions, WebWorkerFunctionsExtended = WebWorkerFunctions> {
  protected __webWorker: Worker;

  protected __callbacksMap: Map<number, WebWorkerCallback> = new Map();
  protected __callbacksID: number = 0;

  constructor(
    webWorker: string | URL,
    webWorkerFunctions: WebWorkerFunctions,
    postfix?: string,
    name?: string,
  ) {
    const webWorkerName = name || this.constructor.name;

    
    this.__webWorker = new Worker(webWorker, { name: webWorkerName, type: "module", });
    this.__webWorker.onmessage = (event) => this.processResult(event);
    
    const functionsMap = WebWorkerManagerInterfaceCreateMapping(postfix || "", webWorkerFunctions);
    for (const key of Object.getOwnPropertyNames(functionsMap)) {
      const wrapperName = key;
      const workerName = functionsMap[key];
      (this[wrapperName as keyof this] as WebWorkerManagerFunctionGeneric) = (
        resolve: WebWorkerResolveGeneric,
        onerror: WebWorkerError,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
      ) => {
        this.callFunction(workerName as keyof WebWorkerFunctionsExtended, args, resolve, onerror ? onerror : (error)=> console.error(error));
      };
    }
  }

  protected addCallback(callback: WebWorkerCallback): number {
    const callbackID = this.__callbacksID;
    this.__callbacksMap.set(callbackID, callback);
    this.__callbacksID += 1;

    return callbackID;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected processCallback(callbackID: number, args: any) {
    const callback = this.__callbacksMap.get(callbackID);
    variableExistsOrThrowDev(callback, `Missing callback ${callbackID}`);
    callback.resolve(args);

    this.__callbacksMap.delete(callbackID);
  }

  protected throwError(callbackID: number, error: unknown) {
    const callback = this.__callbacksMap.get(callbackID);
    variableExistsOrThrowDev(callback, `Missing callback ${callbackID}`);
    if (callback.onerror) callback.onerror(error);
    else throw Error(`Unhandled error: ${error}`);

    this.__callbacksMap.delete(callbackID);
  }

  terminate() {
    this.__webWorker.terminate();
  }

  /**
   * Don't call it directly. Make wrapers for each function to test args types and avoid using IDs
   */
  protected callFunction(
    funcID: keyof WebWorkerFunctionsExtended,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[],
    resolve: WebWorkerResolveGeneric,
    onerror: WebWorkerError
  ) {
    isKeyOrThrowDev(funcID, this);
    const callback: WebWorkerCallback = { resolve, onerror };
    const callbackID = this.addCallback(callback);

    const payload: WebWorkerPayload<WebWorkerFunctionsExtended> = {
      callbackID,
      funcID,
      args,
    };
    this.__webWorker.postMessage(payload);
  }

  protected processResult(event: MessageEvent) {
    const result = event.data as WebWorkerResult;
    if (result.success) {
      this.processCallback(result.callbackID, result.args);
    } else {
      this.throwError(result.callbackID, result.args);
    }
  }
}
