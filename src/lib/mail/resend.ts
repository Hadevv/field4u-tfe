/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Resend } from "resend";
import { env } from "../env";

// créer une instance de resend avec une clé api valide ou une clé factice
// pour éviter l'erreur "Neither apiKey nor config.authenticator provided"
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

  // définir l'authenticator manuellement pour éviter l'erreur lors du build
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (resend as any)._setAuthenticator({
    async authenticate() {
      return { type: "Bearer", token: "mock_token" };
    },
  });

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
