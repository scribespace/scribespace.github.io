
export interface ValueUnit {
    value: number;
    unit: string;
}

export interface Font {
    name: string;
    alt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (...args: any[]) => any;

export type IsFunction< F > = F extends Func ? F : never;


export type CreateFunctions<T extends string> = {
    [K in T]: Func
};


export type ObjectInterface = { [key: string]: Func };
export type MousePosition = {
  x: number;
  y: number;
};
