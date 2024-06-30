export class Mutex {
    private __current = Promise.resolve();
    async lock() {
        let _resolve: (value: void | PromiseLike<void>) => void;
        const promise = new Promise<void>( resolve => {_resolve = () => resolve();} );

        const waitForPromise =  this.__current.then( () => _resolve );

        this.__current = promise;

        return waitForPromise;
    }
}