import { Resend } from "resend";
import { env } from "../env";

const createResendMock = (): Resend => {
  const mockMethod = async () => ({
    data: null,
    error: { message: "resend api key not configured", statusCode: 500 },
  });

  return {
    emails: {
      send: mockMethod,
    },
    apiKeys: {
      create: mockMethod,
      list: mockMethod,
      get: mockMethod,
      update: mockMethod,
      remove: mockMethod,
    },
    contacts: {
      create: mockMethod,
      list: mockMethod,
      get: mockMethod,
      update: mockMethod,
      remove: mockMethod,
    },
    audiences: {
      create: mockMethod,
      list: mockMethod,
      get: mockMethod,
      remove: mockMethod,
    },
    domains: {
      create: mockMethod,
      verify: mockMethod,
      list: mockMethod,
      get: mockMethod,
      remove: mockMethod,
    },
    batch: {
      send: mockMethod,
    },
    apiUrl: "",
    headers: {},
  } as unknown as Resend;
};

export const resend =
  env.RESEND_API_KEY && env.RESEND_API_KEY !== "re_123456"
    ? new Resend(env.RESEND_API_KEY)
    : createResendMock();
