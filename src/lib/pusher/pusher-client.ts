import Pusher from "pusher-js";
import { env } from "@/lib/env";

// config pusher client
export const pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY || "", {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
  forceTLS: true,
});
