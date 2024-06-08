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

  protected async callFunction(payload: WebWorkerPayload<ThreadInterface>) {
    try {
      isFunctionOrThrowDev(this.threadFunctions[payload.funcID]);

      const result = await (this.threadFunctions[payload.funcID] as Func)(...payload.args);
      self.postMessage({
        success: true,
        callbackID: payload.callbackID,
        args: result,
      } as WebWorkerResult);
    } catch (error) {
      self.postMessage({
        success: false,
        callbackID: payload.callbackID,
        args: [error],
      } as WebWorkerResult);
    }
  }
}
