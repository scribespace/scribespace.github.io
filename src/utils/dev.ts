import {
  isFunctionOrThrow,
  isKeyOrThrow,
  variableExistsOrThrow,
} from "./common";
import { Func } from "./types/types";

export function devOnly(dev: () => void) {
  const func = import.meta.env.DEV ? dev : () => {};
  func();
}

export function assert(test: boolean, message: string) {
  devOnly(() => {
    if (!test) throw Error("Assert failed: " + message);
  });
}

export function notNullOrThrow<T>(value: T | null): asserts value is T {
  if (value == null) throw Error("Value is null");
}

export function notNullOrThrowDev<T>(value: T | null): asserts value is T {
  devOnly(() => {
    notNullOrThrow(value);
  });
}

export function valueValidOrThrowDev<T>(
  value: T | null | undefined
): asserts value is T {
  devOnly(() => {
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
  devOnly(() => {
    variableExistsOrThrow(variable, message);
  });
}

export function isKeyOrThrowDev<T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: keyof any,
  obj: T
): asserts key is keyof T {
  devOnly(() => {
    isKeyOrThrow(key, obj);
  });
}

export function isFunctionOrThrowDev(func: unknown): asserts func is Func {
  devOnly(() => {
    isFunctionOrThrow(func);
  });
}
