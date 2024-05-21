export function variableExists( variable: any ) {
    return typeof variable !== 'undefined';
}

export interface ValueUnit {
    value?: number;
    unit?: string | null;
}

export function separateValueAndUnit(valueUnit: string): ValueUnit {
    const regex = /^(-?\d+\.?\d*)([a-zA-Z%]*)$/;
    const match = valueUnit.match(regex);
    if (match) {
        return {
            value: parseFloat(match[1]),
            unit: match[2] || null
        };
    } else {
        throw new Error('separateValueAndUnit: Invalid input format');
    }
}

export function copyExistingValues<T>(values: T | Partial<T> | null | undefined, defaultValues: T): T {
    if ( !values ) return defaultValues;

    const newValues = defaultValues;
    for ( const field in values ) {
        (newValues as any)[field] = (values as any)[field]
    }

    return newValues;
}

// @ts-ignore: Unused function
export const notImplemented = () => {
    throw Error("Not implemented");
};
