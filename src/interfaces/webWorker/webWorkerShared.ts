/* eslint-disable @typescript-eslint/no-explicit-any */
import { Func } from "@utils";

export type WebWorkerResolveGeneric = (result: any) => void;
export type WebWorkerError = ((error: unknown) => void) | undefined;

export interface WebWorkerFunctionAttributes {
  resolve?: WebWorkerResolveGeneric,
  onerror?: WebWorkerError,
  transfer?: any[],
}

export type WebWorkerManagerFunctionGeneric = (
  attributes: WebWorkerFunctionAttributes,
  ...args: any[]
) => void;


export type WebWorkerManagerInterface<I, Postfix extends string = ''> = {
  [N in keyof I as I[N] extends Func ? `${string & N}${Postfix}` : never]: I[N] extends Func ? (
    attributes: {
      resolve?: Awaited<ReturnType<I[N]>> extends any[] ? ((...args: Awaited<ReturnType<I[N]>>) => void) : ((result: Awaited<ReturnType<I[N]>>) => void),
      onerror?: WebWorkerError,
      transfer?: any[]
    },
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
  args: any;
}

export interface WebWorkerCallback {
  resolve: WebWorkerResolveGeneric;
  onerror: WebWorkerError;
}
