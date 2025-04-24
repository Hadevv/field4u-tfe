"use server";

import { auth } from "@/lib/auth/helper";
import { action } from "@/lib/backend/safe-actions";
import { sendEmail } from "@/lib/mail/sendEmail";
import { prisma } from "@/lib/prisma";
import { SiteConfig } from "@/site-config";
import { ContactFeedbackSchema } from "./contact-feedback.schema";

export const contactSupportAction = action
  .schema(ContactFeedbackSchema)
  .action(async ({ parsedInput: data }) => {
    const user = await auth();

    const email = user?.email ?? data.email;

    const feedback = await prisma.feedback.create({
      data: {
        message: data.message,
        review: data.review,
        userId: user?.id,
        email,
      },
    });

    await sendEmail({
      from: SiteConfig.email.from,
      to: SiteConfig.email.contact,
      subject: `Nouveau feedback de ${email}`,
      text: `Note: ${feedback.review}\n\nMessage: ${feedback.message}`,
      replyTo: email,
    });

    return { message: "Votre feedback a été envoyé à l'assistance." };
  });
