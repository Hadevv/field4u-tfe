import nodemailer from "nodemailer";
import { type ReactElement } from "react";
import { render } from "@react-email/components";

const mailhogTransport = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
  ignoreTLS: true,
});

export const sendMailhogEmail = async ({
  from,
  to,
  subject,
  text,
  html,
  react,
}: {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  react?: ReactElement;
}) => {
  let htmlContent = html;

  if (react) {
    htmlContent = await render(react);
  }

  return mailhogTransport.sendMail({
    from,
    to,
    subject,
    text,
    html: htmlContent,
  });
};
