import { Inngest } from "inngest";
import { env } from "../env";

export const inngest = new Inngest({
  eventKey: env.INNGEST_EVENT_KEY,
  id: "field4u",
});

// définir les types d'event
export type GleaningJoinedEvent = {
  name: "glanage.joined";
  data: {
    gleaningId: string;
    userId: string;
    announcementId: string;
    startDate: Date;
  };
};

export type GleaningCanceledEvent = {
  name: "glanage.canceled";
  data: {
    gleaningId: string;
    announcementTitle: string;
    announcementId: string;
  };
};

export type Events = GleaningJoinedEvent | GleaningCanceledEvent;
