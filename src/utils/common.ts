import { devOnly } from "./dev";
import { Func, ValueUnit } from "./types";

export function variableExists<T>( variable: T | undefined ): variable is T {
    return typeof variable !== 'undefined';
}

export function variableExistsOrThrow<T>( variable: T | undefined, message: string ): asserts variable is T {
    if ( !variableExists(variable) ) throw Error(message);
}

export function variableExistsOrThrowDev<T>(variable: T | undefined, message: string): asserts variable is T {
    devOnly(() => {
        variableExistsOrThrow(variable, message);
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isKey<T extends object>( key: keyof any, obj: T ): key is keyof T {
    return key in obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isKeyOrThrow<T extends object>( key: keyof any, obj: T ): asserts key is keyof T {
    if ( !isKey(key, obj) ) throw Error(`${String(key)} isn't part of ${obj}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isKeyOrThrowDev<T extends object>( key: keyof any, obj: T ): asserts key is keyof T {
    devOnly(() => {
        isKeyOrThrow(key, obj);
    });
}

export function isFunction(func: unknown): func is Func {
    return typeof func == 'function';
}

export function isFunctionOrThrow(func: unknown): asserts func is Func {
    if ( !isFunction(func) ) throw Error( `${func} not a function` );
}

export function isFunctionOrThrowDev(func: unknown): asserts func is Func {
    devOnly(()=> {
        isFunctionOrThrow(func);
    });
}

export function separateValueAndUnit(valueUnit: string): ValueUnit {
    const regex = /^(-?\d+\.?\d*)([a-zA-Z%]*)$/;
    const match = valueUnit.match(regex);
    if (match) {
        return {
            value: parseFloat(match[1]),
            unit: match[2] || ''
        };
    } else {
        throw new Error('separateValueAndUnit: Invalid input format');
    }
}

export function isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function copyExistingValues<T>(values: T | Partial<T> | null | undefined, defaultValues: T): T {
    if ( !values ) return defaultValues;

    const newValues: T = { ...defaultValues};
    for ( const field in values ) {
        const fieldValue = values[field as keyof T];
        if ( isObject(fieldValue) ) {
            newValues[field as keyof T] = copyExistingValues<T[keyof T]>(fieldValue as Partial<T[keyof T]>, newValues[field as keyof T] );
        } else {
            newValues[field as keyof T] = fieldValue as T[keyof T];
        }
    }

    return newValues;
}

export const urlRegExp = new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.)[A-Za-z0-9-]+\.[A-Za-z]{2,})((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
  );
  export function validateUrl(url: string): boolean {
    return url === 'https://' || urlRegExp.test(url);
  }

export function OpenURL(url: string) {
    if (validateUrl(url)) {
        const validURL = url; // url.match(/^https?:/) ? url : '//' + url;
        window.open(validURL, '_blank')?.focus();
    }
}