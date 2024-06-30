import { vi } from "vitest";

let uuid = 0;

vi.stubGlobal('crypto', {
    randomUUID: () => { return (uuid++).toString();},
});