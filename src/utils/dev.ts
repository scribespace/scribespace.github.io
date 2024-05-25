
export function devOnly(dev: () => void) {
    const func = import.meta.env.DEV ? dev : () => { };
    func();
}

export function assert(test: boolean, message: string) {
    devOnly(() => {
        if (!test) throw Error('Assert failed: ' + message);
    });
}
// tslint:disable-next-line

export const notImplemented = () => {
    throw Error("Not implemented");
};
