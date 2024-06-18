import { afterEach } from "vitest";
import * as ReactTest from "@testing-library/react";

export {ReactTest};

export function reactSetup() {
  afterEach(ReactTest.cleanup);
}