
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Font {
  name: string;
  alt: string;
}

export type CSSTheme = string;

export type BaseFunc = () => void;
export type Func = (...args: any[]) => any;

export type IsFunction<F> = F extends Func ? F : never;

export type CreateFunctions<T extends string> = {
  [K in T]: Func;
};

export type ObjectInterface = { [key: string]: Func };
export type MousePosition = {
  x: number;
  y: number;
};

export type OnlyFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};

export class EmptyClass {}

export type Constructor = new (...args: any[]) => object;
export type GConstructor<T> = new (...args: any[]) => T;