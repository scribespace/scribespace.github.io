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

export function isObject(item: any ){
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function copyExistingValues<T>(values: T | Partial<T> | null | undefined, defaultValues: T): T {
    if ( !values ) return defaultValues;

    const newValues = defaultValues;
    for ( const field in values ) {
        const fieldValue = (values as any)[field];
        if ( isObject(fieldValue) ) {
            (newValues as any)[field] = copyExistingValues<T>(fieldValue, (newValues as any)[field] );
        } else {
            (newValues as any)[field] = fieldValue;
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

// @ts-ignore: Unused function
export const notImplemented = () => {
    throw Error("Not implemented");
};export function OpenURL(url: string) {
    if (validateUrl(url)) {
        const validURL = url; // url.match(/^https?:/) ? url : '//' + url;
        window.open(validURL, '_blank')?.focus();
    }
}

