// import api, { ensureCsrfCookie } from "@/database/api";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    // authorizer: (channel: unknown) => {
    //     return {
    //         authorize(socketId: string, callback: (err: unknown, auth?: unknown) => void) {
    //             // use promise chain so this function returns void (Echo expects a void authorizer)
    //             ensureCsrfCookie()
    //                 .then(() =>
    //                     api.post(`/broadcasting/auth`, {
    //                         socket_id: socketId,
    //                         channel_name: (channel as { name: string }).name,
    //                     }),
    //                 )
    //                 .then((response) => callback(null, response.data))
    //                 .catch((error) => {
    //                     console.error("Broadcast auth error:", error);
    //                     callback(error instanceof Error ? error : new Error(String(error)));
    //                 });
    //         },
    //     };
    // },
});
