import { Func, isFunctionOrThrowDev } from "@utils";
import { WebWorkerPayload, WebWorkerResult } from "./webWorkerShared";

export class WebWorkerThread<ThreadInterface> {
  threadFunctions: ThreadInterface;
  constructor(functions: ThreadInterface) {
    this.threadFunctions = functions;

    self.onmessage = (event) => {
      const payload: WebWorkerPayload<ThreadInterface> = event.data;
      this.callFunction(payload);
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private respond( callbackID: number, result: any ) {
    self.postMessage({
      success: true,
      callbackID: callbackID,
      args: result,
    } as WebWorkerResult);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onerror(callbackID: number, error: any) {
    self.postMessage({
      success: false,
      callbackID: callbackID,
      args: [error],
    } as WebWorkerResult);
  }

  protected async callFunction(payload: WebWorkerPayload<ThreadInterface>) {
    try {
      isFunctionOrThrowDev(this.threadFunctions[payload.funcID]);

      const result = (this.threadFunctions[payload.funcID] as Func)(...payload.args);
      if ( result instanceof Promise ) {
        result.then( (res) => this.respond(payload.callbackID, res) ).catch( (error) => this.onerror(payload.callbackID, error));
      } else {
        this.respond(payload.callbackID, result);
      }

    } catch (error) {
      this.onerror(payload.callbackID, error);
    }
  }
}
