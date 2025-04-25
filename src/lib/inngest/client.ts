import { Inngest } from "inngest";
import { env } from "../env";

// utiliser une approche lazy initialization pour éviter l'erreur avec la clé
let inngestInstance: Inngest | null = null;

export const getInngest = () => {
  if (!inngestInstance) {
    inngestInstance = new Inngest({
      eventKey: env.INNGEST_EVENT_KEY || "",
      id: "field4u",
    });
  }
  return inngestInstance;
};

// maintenir une compatibilité avec le code existant
export const inngest = new Proxy({} as Inngest, {
  get: (target, prop) => {
    return getInngest()[prop as keyof Inngest];
  },
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
