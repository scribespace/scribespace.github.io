
import { $deserialize, $serialize } from "@systems/serializer/serializer";
import { describe, expect, test } from "vitest";

describe('Serializer:',
() => {
        test('Uber Object',
            () => {
              const testObject = {
                name: 'sialal',
                version: 5432,
                enabled: false,
                children0: [1,4,6,4],
                children1: [true, true, false, true],
                children2: ['ada', 'gg', 'łdsaa'],
                children3: [
                    {field0: 'ss', field1: 34, field2: false, field3: [5,10,22]}, 
                    {field0: 's5s', field1: 324, field2: false, field3: ['h','e','l']}, 
                    {field0: 'ss', field1: 34, field2: false, field3: [{field0:13, field1:'gg'},{field0:173, field1:'agg'},{field0:134, field1:'gg2'}]}
                ],
                children4:[
                    [23, 543, 6],
                    [4, 5438, 5],
                    [3, 3, 0],
                ],
                childObject: {
                    field0: 'testest',
                    field1: true,
                    field2: 0,
                }
              };

              const serializedObject = $serialize(testObject);

              const deserializedObject = $deserialize(serializedObject);

              expect( JSON.stringify(testObject) ).toBe(JSON.stringify(deserializedObject));
            }
        );
    }
);