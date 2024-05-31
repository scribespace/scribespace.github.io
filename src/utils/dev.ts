import { variableExistsOrThrow } from "./common";

export function devOnly(dev: () => void) {
    const func = import.meta.env.DEV ? dev : () => { };
    func();
}

export function assert(test: boolean, message: string) {
    devOnly(() => {
        if (!test) throw Error('Assert failed: ' + message);
    });
}

export function notNullOrThrow<T>(value: T | null): asserts value is T {
    if ( value == null ) throw Error('Value is null');
}

export function notNullOrThrowDev<T>(value: T | null): asserts value is T {
    devOnly(
        () => {
            notNullOrThrow(value);
        }
    );
}

export function valueValidOrThrowDev<T>(value: T | null | undefined): asserts value is T {
    devOnly(
        () => {
            variableExistsOrThrow(value, "Variable is undefined");
            notNullOrThrow(value);
        }
    );
}

// tslint:disable-next-line
export const notImplemented = () => {
    throw Error("Not implemented");
};
