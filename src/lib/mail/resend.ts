import { Resend } from "resend";
import { env } from "../env";

// au lieu d'initialiser resend directement, on utilise une approche lazy
let resendInstance: Resend | null = null;

export const getResend = () => {
  if (!resendInstance) {
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing");
    }
    resendInstance = new Resend(env.RESEND_API_KEY);
  }
  return resendInstance;
};

// types pour les méthodes de contacts
type ContactsParams = {
  create: Parameters<typeof Resend.prototype.contacts.create>;
  list: Parameters<typeof Resend.prototype.contacts.list>;
  get: Parameters<typeof Resend.prototype.contacts.get>;
  update: Parameters<typeof Resend.prototype.contacts.update>;
  remove: Parameters<typeof Resend.prototype.contacts.remove>;
};

// pour la compatibilité avec le code existant
export const resend = {
  emails: {
    send: (...args: Parameters<typeof Resend.prototype.emails.send>) => {
      return getResend().emails.send(...args);
    },
  },
  contacts: {
    create: (...args: ContactsParams["create"]) => {
      return getResend().contacts.create(...args);
    },
    list: (...args: ContactsParams["list"]) => {
      return getResend().contacts.list(...args);
    },
    get: (...args: ContactsParams["get"]) => {
      return getResend().contacts.get(...args);
    },
    update: (...args: ContactsParams["update"]) => {
      return getResend().contacts.update(...args);
    },
    remove: (...args: ContactsParams["remove"]) => {
      return getResend().contacts.remove(...args);
    },
  },
};
