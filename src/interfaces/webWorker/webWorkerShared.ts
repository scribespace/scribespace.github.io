/* eslint-disable @typescript-eslint/no-explicit-any */
import { Func } from "@utils";

export type WebWorkerResolveGeneric = (...args: any[]) => void;
export type WebWorkerResolve<Args extends unknown[]> = (...args: Args) => void;
export type WebWorkerError = ((error: unknown) => void) | undefined;

export type WebWorkerManagerFunctionGeneric = (
  resolve: WebWorkerResolveGeneric,
  onerror: WebWorkerError,
  ...args: any[]
) => void;

//type WebWorkerResolveExpanded<Resolve> = Resolve extends WebWorkerResolve< infer 
export type WebWorkerManagerFunctionParams< Args extends unknown[], Return extends unknown[]> = {resolve: WebWorkerResolve<Return>,args: Args};

export type WebWorkerManagerFunction<Packed> =
  Packed extends WebWorkerManagerFunctionParams<infer Args, infer Return>
    ? (
        resolve: WebWorkerResolve<Return>,
        onerror: WebWorkerError,
        ...args: Args
      ) => void
    : never;

export type WebWorkerManagerInterface<I, Postfix extends string = ''> = {
  [N in keyof I as I[N] extends Func ? `${string & N}${Postfix}` : never]: I[N] extends Func ? (
    resolve: (...args: Awaited<ReturnType<I[N]>>) => void,
    onerror: WebWorkerError,
    ...args: Parameters<I[N]>
  ) => void : never;
};

export type WebWorkerFunctionsMap = {[key:string]: string};
export function WebWorkerManagerInterfaceCreateMapping<T>( postfix: string, obj: T ): WebWorkerFunctionsMap {
  const map: WebWorkerFunctionsMap = {};
  for ( const key of Object.getOwnPropertyNames(obj) ) {
    map[key+postfix] = key;
  }

  return map;
}

export interface WebWorkerPayload<ThreadInterface> {
  callbackID: number;
  funcID: keyof ThreadInterface;
  args: any[];
}

export interface WebWorkerResult {
  success: boolean;
  callbackID: number;
  args: any[];
}

export interface WebWorkerCallback {
  resolve: WebWorkerResolveGeneric;
  onerror: WebWorkerError;
}
