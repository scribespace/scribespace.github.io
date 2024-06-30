if ( typeof Worker == 'undefined' ) {
    global.Worker = class {
        onmessage() {

        }

        onmessageerror() {

        }
        postMessage() {

        }
        terminate() {

        }
        addEventListener() {

        }
        removeEventListener() {

        }
        dispatchEvent() {
            return false;
        }
        onerror() {

        }
    };
}