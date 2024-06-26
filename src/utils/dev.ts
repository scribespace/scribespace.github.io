import { DEV } from "@systems/environment";
import {
  isFunctionOrThrow,
  isKeyOrThrow,
  variableExists,
  variableExistsOrThrow,
} from "./common";
import { Func } from "./types/types";

export function assert(test: boolean, message: string): asserts test {
  DEV(() => {
    if (!test) throw Error("Assert failed: " + message);
  });
}

export function notNullOrThrow<T>(value: T | null): asserts value is T {
  if (value == null) throw Error("Value is null");
}

export function notNullOrThrowDev<T>(value: T | null): asserts value is T {
  DEV(() => {
    notNullOrThrow(value);
  });
}

export function nullOrThrow<T>(value: T | null): asserts value is null {
  if (value != null) throw Error("Value is not null");
}

export function nullOrThrowDev<T>(value: T | null): asserts value is null {
  DEV(() => {
    nullOrThrow(value);
  });
}

export function valueValidOrThrowDev<T>(
  value: T | null | undefined
): asserts value is T {
  DEV(() => {
    variableExistsOrThrow(value, "Variable is undefined");
    notNullOrThrow(value);
  });
}

// tslint:disable-next-line
export const notImplemented = () => {
  throw Error("Not implemented");
};

export function variableExistsOrThrowDev<T>(
  variable: T | undefined,
  message: string
): asserts variable is T {
  DEV(() => {
    variableExistsOrThrow(variable, message);
  });
}

export function isKeyOrThrowDev<T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: keyof any,
  obj: T
): asserts key is keyof T {
  DEV(() => {
    isKeyOrThrow(key, obj);
  });
}

export function isFunctionOrThrowDev(func: unknown): asserts func is Func {
  DEV(() => {
    isFunctionOrThrow(func);
  });
}

export function getStack() {
  const error = new Error();
  if ( variableExists(error.stack) ) {
    return error.stack.split('\n');
  }
  return [];
}