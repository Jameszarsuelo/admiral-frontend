import api, { ensureCsrfCookie } from "@/database/api";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authorizer: (channel) => {
    return {
        authorize: async (socketId) => {
            try {
                // 1. Ensure Sanctum CSRF cookie exists
                await ensureCsrfCookie();

                // 2. Now POST to /broadcasting/auth with CSRF + session cookie
                await api.post("/broadcasting/auth", {
                    socket_id: socketId,
                    channel_name: channel.name,
                });

                // callback(false, response.data);
            } catch (error) {
                console.error("Broadcast auth error:", error);
                // callback(true, error);
            }
        },
    };
},
});
