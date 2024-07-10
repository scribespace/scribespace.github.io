import { ErrorCode } from "./errorCodes";

export interface ErrorObject {
    errorCode: ErrorCode;
    errorData: unknown;
    error: Error;    
}
export function $throwError(errorCode: ErrorCode, errorMessage?: string, errorData?: unknown ): never {
    const errorObject: ErrorObject = {
        errorCode,
        errorData,
        error: new Error(errorMessage)
    };
    throw errorObject;
}