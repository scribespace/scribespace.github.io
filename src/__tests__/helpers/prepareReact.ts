import { afterEach } from "vitest";
import * as ReactTest from "@testing-library/react";
import '@/components/shortcuts/shortcutsCommands';

export {ReactTest};

export function reactSetup() {
  afterEach(ReactTest.cleanup);
}