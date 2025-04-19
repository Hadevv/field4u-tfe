import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { remindersFunction } from "@/lib/inngest/functions/reminders";
import { cancelationsFunction } from "@/lib/inngest/functions/cancelations";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [remindersFunction, cancelationsFunction],
});
