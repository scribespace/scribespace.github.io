import * as ReactTest from "@testing-library/react";
export {ReactTest};

import { afterEach } from "vitest";
import '@/components/shortcuts/shortcutsCommands';


export function reactSetup() {
  afterEach(() => {ReactTest.cleanup();});
}