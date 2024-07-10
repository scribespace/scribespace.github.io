import { $throwError } from "@/utils/error/error";
import { ErrorCode } from "@/utils/error/errorCodes";
import { notNullOrThrowDev, variableExistsOrThrowDev } from "@utils";

const OBJECT = 0 as const;
const NUMBER = 1 as const;
const STRING = 2 as const;
const BOOLEAN = 3 as const;
const ARRAY = 4 as const;

const textEncoder = new TextEncoder();

type SerializableSimpleTypes = object | string | number | boolean;
type SerializableTypes = SerializableSimpleTypes | Array<SerializableSimpleTypes>;

export interface SerializerErrorData {
    type: string;
}

function serializeNumber( value: number ): Uint8Array {
    const bytesArray = new Uint8Array(4);
    const dataView = new DataView(bytesArray.buffer);
    dataView.setUint32(0, value);

    return new Uint8Array( dataView.buffer );
}

function serializeString( fieldStr: string, serializedArrays: Uint8Array[] ) {
    const serializedString = textEncoder.encode( fieldStr );

    serializedArrays.push( serializeNumber(serializedString.length) );
    serializedArrays.push( serializedString);
}
function serializeFieldString( fieldStr: string, serializedArrays: Uint8Array[] ) {
    serializedArrays.push( new Uint8Array([STRING]) );
    serializeString(fieldStr, serializedArrays);
}

function serializeFieldNumber( fieldNr: number, serializedArrays: Uint8Array[] ) {
    const serializedNumber = serializeNumber(fieldNr);
    serializedArrays.push( new Uint8Array([NUMBER]) );
    serializedArrays.push( serializedNumber );
}

function serializeFieldBoolean( fieldBool: boolean, serializedArrays: Uint8Array[] ) {
    const serializedBoolean = new Uint8Array([fieldBool ? 1:0]);
    serializedArrays.push( new Uint8Array([BOOLEAN]) );
    serializedArrays.push( serializedBoolean );
}

function serializeFieldArray( fieldArray: Array<SerializableSimpleTypes>, serializedArrays: Uint8Array[] ) {
    serializedArrays.push( new Uint8Array([ARRAY]) );
    const arrayLength = fieldArray.length;
    const serializedLength = serializeNumber(arrayLength);
    serializedArrays.push( serializedLength );

    for ( const element of fieldArray ) {
        serializeValue( element, serializedArrays );
    }
}

function serializeFieldObject( fieldObject: object, serializedArrays: Uint8Array[] ) {
    const objectSerializedArray: Uint8Array[] = [];
    for ( const field in fieldObject ) {
        const fieldValue = fieldObject[field as keyof typeof fieldObject];
        notNullOrThrowDev(fieldValue);
        variableExistsOrThrowDev(fieldValue, 'Serialized variable undefined');

        serializeString( field, objectSerializedArray );
        serializeValue( fieldValue, objectSerializedArray );
    }

    
    let objectSize = 0;
    for ( const array of objectSerializedArray ) {
        objectSize += array.length;
    }

    const byteBuffer = new Uint8Array(objectSize);
    let currentOffset = 0;
    for ( const array of objectSerializedArray ) {
        byteBuffer.set( array, currentOffset );
        currentOffset += array.length;
    }

    
    serializedArrays.push( new Uint8Array([OBJECT]));
    serializedArrays.push( serializeNumber(objectSize) );
    serializedArrays.push( byteBuffer );
}

function serializeValue( value: SerializableTypes, serializedArrays: Uint8Array[] ) {
    const type = Array.isArray(value) ? 'array' : typeof value;
    switch ( type ) {
        case 'boolean':
            serializeFieldBoolean(value as boolean, serializedArrays);
            break;
        case 'string':
            serializeFieldString(value as string, serializedArrays);
            break;
        case 'number':
            serializeFieldNumber(value as number, serializedArrays);
            break;
        case 'object':
            serializeFieldObject( value as object, serializedArrays);
            break;
        case 'array':
            serializeFieldArray(value as Array<SerializableSimpleTypes>, serializedArrays);
            break;
        default:
            $throwError(ErrorCode.Serializer_MissingType, `Missing type`, {type} as SerializerErrorData);
    }
}

export function $serialize( value: SerializableTypes ): Uint8Array {
    const serializedArrays: Uint8Array[] = [];

    serializeValue(value, serializedArrays);

    let arrayLength = 0;
    for ( const array of serializedArrays ) {
        arrayLength += array.length;
    }

    const byteBuffer = new Uint8Array(arrayLength);

    let currentOffset = 0;
    for ( const array of serializedArrays ) {
        byteBuffer.set( array, currentOffset );
        currentOffset += array.length;
    }

    return byteBuffer;
}

export interface DeserializerErrorData {
    type: number;
}

const textDecoder = new TextDecoder();

interface BytesStream {
    bytes: Uint8Array;
}

function deserializeNumber( bytesStream: BytesStream ): number {
    const bytesArray = bytesStream.bytes;
    const dataView = new DataView( bytesArray.buffer, bytesArray.byteOffset, 4 );
    const deserializedValue = dataView.getUint32(0);
    bytesStream.bytes = bytesArray.subarray(4);

    return deserializedValue;
}

function deserializeString( bytesStream: BytesStream ): string {
    const stringSize = deserializeNumber( bytesStream );

    const bytesArray = bytesStream.bytes;
    const deserializedValue = textDecoder.decode( bytesArray.subarray( 0, stringSize ) );
    bytesStream.bytes = bytesArray.subarray(stringSize);

    return deserializedValue;
}

function deserializeFieldBoolean( bytesStream: BytesStream ): boolean {
    const bytesArray = bytesStream.bytes;
    const deserializedValue = bytesArray[0] > 0;
    bytesStream.bytes = bytesArray.subarray(1);

    return deserializedValue;
}

function deserializeFieldArray( bytesStream: BytesStream ): Array<SerializableSimpleTypes> {
    const arrayLength = deserializeNumber( bytesStream );
    const array: Array<SerializableSimpleTypes> = new Array(arrayLength);

    for ( let i = 0; i < arrayLength; ++i ) {
        array[i] = deserializeValue(bytesStream);
    }

    return array;
}

function deserializeFieldObject( bytesStream: BytesStream ): object {
    const obj: {[k: string]: unknown} = {};

    const objectSize  = deserializeNumber(bytesStream);

    const bytesArray = bytesStream.bytes;
    const objectByteArray = bytesArray.subarray( 0, objectSize );
    const objectByteStream: BytesStream = { bytes: objectByteArray };

    while ( objectByteStream.bytes.length > 0 ) {
        const fieldName = deserializeString(objectByteStream);
        obj[fieldName] = deserializeValue(objectByteStream);
    }

    bytesStream.bytes = bytesArray.subarray(objectSize);
    return obj;
}


function deserializeValue( bytesStream: BytesStream ): SerializableTypes {
    const fieldType = bytesStream.bytes[0];
    bytesStream.bytes = bytesStream.bytes.subarray(1);

    let deserializedField: SerializableTypes;
    switch ( fieldType ) {
        case OBJECT:
            deserializedField = deserializeFieldObject(bytesStream);
            break;
        case STRING:
            deserializedField = deserializeString(bytesStream);
            break;
        case NUMBER:
            deserializedField = deserializeNumber(bytesStream);
            break;
        case BOOLEAN:
            deserializedField = deserializeFieldBoolean(bytesStream);
            break;
        case ARRAY:
            deserializedField = deserializeFieldArray(bytesStream);
            break;
        default:
            $throwError(ErrorCode.Deserializer_MissingType, `Missing type`, {type: fieldType} as DeserializerErrorData);
    }

    return deserializedField;
}


export function $deserialize(byteArray: Uint8Array): SerializableTypes {
    const bytesStream: BytesStream = { bytes: byteArray };
    return deserializeValue(bytesStream);
}