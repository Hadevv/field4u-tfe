import { SiteConfig } from "@/site-config";
import { env } from "../env";
import { resend } from "./resend";
import { sendMailhogEmail } from "./mailhog";
import { ReactElement } from "react";

type ResendSendType = typeof resend.emails.send;
type ResendParamsType = Parameters<ResendSendType>;
type ResendParamsTypeWithConditionalFrom = [
  payload: Omit<ResendParamsType[0], "from"> & { from?: string },
  options?: ResendParamsType[1],
];

export const sendEmail = async (
  ...params: ResendParamsTypeWithConditionalFrom
) => {
  const fromEmail = params[0].from ?? SiteConfig.email.from;
  let subject = params[0].subject;

  if (env.NODE_ENV === "development") {
    subject = `[DEV] ${subject}`;
  }

  if (env.NODE_ENV === "development" && env.USE_MAILHOG === "true") {
    return sendMailhogEmail({
      from: fromEmail,
      to: params[0].to,
      subject,
      react: params[0].react as ReactElement,
      html: params[0].html,
      text: params[0].text,
    });
  }

  const resendParams = [
    {
      ...params[0],
      from: fromEmail,
      subject,
    } as ResendParamsType[0],
    params[1],
  ] satisfies ResendParamsType;

  return resend.emails.send(...resendParams);
};
