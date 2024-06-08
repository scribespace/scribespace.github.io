import {
  isKeyOrThrowDev,
  variableExistsOrThrowDev
} from "@utils";
import {
  WebWorkerCallback,
  WebWorkerError,
  WebWorkerFunctionAttributes,
  WebWorkerManagerFunctionGeneric,
  WebWorkerManagerInterfaceCreateMapping,
  WebWorkerPayload,
  WebWorkerResolveGeneric,
  WebWorkerResult
} from "./webWorkerShared";

export class WebWorkerManager<WebWorkerFunctionsPublic, WebWorkerFunctionsExtended = WebWorkerFunctionsPublic> {
  protected __webWorker: Worker;

  protected __callbacksMap: Map<number, WebWorkerCallback> = new Map();
  protected __callbacksID: number = 0;

  constructor(
    webWorker: string | URL,
    webWorkerFunctionsPublic: WebWorkerFunctionsPublic,
    postfix?: string,
    name?: string,
  ) {
    const webWorkerName = name || this.constructor.name;

    
    this.__webWorker = new Worker(webWorker, { name: webWorkerName, type: "module", });
    this.__webWorker.onmessage = (event) => this.processResult(event);
    
    const functionsMap = WebWorkerManagerInterfaceCreateMapping(postfix || "", webWorkerFunctionsPublic);
    for (const key of Object.getOwnPropertyNames(functionsMap)) {
      const wrapperName = key;
      const workerName = functionsMap[key];
      (this[wrapperName as keyof this] as WebWorkerManagerFunctionGeneric) = (
        attributes: {
          resolve?: WebWorkerResolveGeneric,
          onerror?: WebWorkerError,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transfer?: any[],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
      ) => {
        this.callFunction(workerName as keyof WebWorkerFunctionsExtended, args, attributes);
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

  private static defaultResolveFunction() {}
  private static defualtOnErrorFunction(error: unknown) {console.error(error);}

  /**
   * Don't call it directly. Make wrapers for each function to test args types and avoid using IDs
   */
  protected callFunction(
    funcID: keyof WebWorkerFunctionsExtended,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[],
    attributes: WebWorkerFunctionAttributes
  ) {
    isKeyOrThrowDev(funcID, this);
    const callback: WebWorkerCallback = { 
      resolve: attributes.resolve ? attributes.resolve : WebWorkerManager.defaultResolveFunction, 
      onerror: attributes.onerror ? attributes.onerror : WebWorkerManager.defualtOnErrorFunction,
    };
    const callbackID = this.addCallback(callback);

    const payload: WebWorkerPayload<WebWorkerFunctionsExtended> = {
      callbackID,
      funcID,
      args,
    };
    if ( attributes.transfer )
      this.__webWorker.postMessage(payload, attributes.transfer );
    else 
      this.__webWorker.postMessage(payload );
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
