/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Resend } from "resend";
import { env } from "../env";

// si pas de clé API valide, utiliser une clé de test qui rendra toutes les requêtes
// avec une erreur de notre mock mais qui n'échouera pas à l'initialisation
export const resend = new Resend(env.RESEND_API_KEY || "re_mockkey_notvalid");

// intercepter les appels à l'API si nous sommes en mode mock
if (!env.RESEND_API_KEY || env.RESEND_API_KEY === "re_123456") {
  const mockResponse = {
    data: null,
    error: {
      message: "resend api key not configured",
      statusCode: 500,
      name: "ResendError",
    },
  };

  // @ts-expect-error - ignorer les erreurs de type pour les mocks
  resend.emails.send = async () => mockResponse;

  // surcharger les autres méthodes avec @ts-expect-error
  if (resend.contacts) {
    // @ts-expect-error
    resend.contacts.create = async () => mockResponse;
    // @ts-expect-error
    resend.contacts.list = async () => ({
      data: [],
      error: mockResponse.error,
    });
    // @ts-expect-error
    resend.contacts.get = async () => mockResponse;
    // @ts-expect-error
    resend.contacts.update = async () => mockResponse;
    // @ts-expect-error
    resend.contacts.remove = async () => mockResponse;
  }
}
