/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isKeyOrThrowDev,
  variableExistsOrThrowDev
} from "@utils";
import {
  WebWorkerCallback,
  WebWorkerFunctionOption,
  WebWorkerManagerFunctionGeneric,
  WebWorkerManagerInterfaceCreateMapping,
  WebWorkerPayload,
  WebWorkerResult
} from "./webWorkerShared";

function getArgOptions( args: any[] ): {args: any[], options: WebWorkerFunctionOption} {
  if ( args.length == 0 ) {
    return {args: [], options: {}};
  }

  const lastArg = args[args.length - 1];
  if ( typeof lastArg == "object" && lastArg !== null && "transfer" in lastArg ) {
    const options = args.pop();
    return {args, options};
  }

  return {args, options: {}};
}

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
      const workerFunctionName = functionsMap[key];
      (this[wrapperName as keyof this] as WebWorkerManagerFunctionGeneric) = (
        ...args: [
          ...args: any[]
        ]
      ): Promise<any> => {
        const {args: callArgs, options: callOptions} = getArgOptions(args);
        return this.callFunction(workerFunctionName as keyof WebWorkerFunctionsExtended, callArgs, callOptions);
      };
    }
  }

  protected addCallback(callback: WebWorkerCallback): number {
    const callbackID = this.__callbacksID;
    this.__callbacksMap.set(callbackID, callback);
    this.__callbacksID += 1;

    return callbackID;
  }

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
    args: any[],
    options: WebWorkerFunctionOption,
  ): Promise<any> {
    isKeyOrThrowDev(funcID, this);

    return new Promise( 
      (resolve, reject) => {  
          const callbackID = this.addCallback({
            resolve: (result: any) => {resolve(result);},
            onerror: (error: any) => {reject(error);}
          });

          const payload: WebWorkerPayload<WebWorkerFunctionsExtended> = {
            callbackID,
            funcID,
            args,
          };

          if ( options.transfer )
            this.__webWorker.postMessage( payload, options.transfer );
          else 
            this.__webWorker.postMessage( payload );
      });
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
