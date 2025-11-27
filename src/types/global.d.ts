import type Pusher from "pusher-js";

declare global {
    // expose the Pusher constructor attached to `window` by our bootstrap code
    interface Window {
        Pusher: typeof Pusher;
    }
}

export {};
