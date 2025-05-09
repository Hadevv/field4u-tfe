import Pusher from "pusher";
import { env } from "@/lib/env";

// config pusher serveur
export const pusherServer = new Pusher({
  appId: env.PUSHER_APP_ID || "",
  key: env.PUSHER_KEY || "",
  secret: env.PUSHER_SECRET || "",
  cluster: env.PUSHER_CLUSTER || "eu",
  useTLS: true,
});
