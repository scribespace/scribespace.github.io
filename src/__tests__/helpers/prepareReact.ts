import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach } from "vitest";


const __env = {
  __reactRoot: null as Root | null,
  __container: null as HTMLElement | null,
  get reactRoot() {
    if (!this.__reactRoot) {
      throw new Error('env.reactRoot not initialized.');
    }
    return this.__reactRoot;
  },
  set reactRoot(reactRoot) {
    this.__reactRoot = reactRoot;
  },
  get container() {
    if (!this.__container) {
      throw new Error('env.container not initialized.');
    }
    return this.__container;
  },
  set container(container) {
    this.__container = container;
  },
  get innerHTML() {
    return (this.container.firstChild as HTMLElement).innerHTML;
  },
  get outerHTML() {
    return this.container.innerHTML;
  },
  reset() {
    this.__reactRoot = null;
    this.__container = null;
  }
};
export const reactEnv: Readonly<typeof __env> = __env;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function prepareReact() {
  beforeEach(
    () => {
      __env.container = document.createElement('div');
      __env.reactRoot = createRoot(__env.container);
      document.body.appendChild(__env.container);
    }
  );

  afterEach(() => {
    __env.container.remove();
    __env.reset();
  });
}
