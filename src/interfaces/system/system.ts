import { assert } from "@/utils";

export interface System {
  getAppID(): string;
  getSystemDomain(): string;
}

let system: System | null = null;

export function $systemSet() {
  return system != null;
}

export function $setSystem(s: System | null) {
  assert(s == null || system == null, "System already set");
  system = s;
}

export function $getSystem() {
  assert(system != null, "System not set yet");
  return system;
}
