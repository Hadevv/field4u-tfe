"use server";

import { auth } from "@/lib/auth/helper";
import { action } from "@/lib/backend/safe-actions";
import { sendEmail } from "@/lib/mail/sendEmail";
import { prisma } from "@/lib/prisma";
import { SiteConfig } from "@/site-config";
import { ContactFeedbackSchema } from "./contact-feedback.schema";
import { sendNotificationToUser } from "@/lib/notifications/sendNotification";
import { NotificationType } from "@prisma/client";

export const contactSupportAction = action
  .schema(ContactFeedbackSchema)
  .action(async ({ parsedInput: data }) => {
    const user = await auth();

    const email = user?.email ?? data.email;

    const feedback = await prisma.feedback.create({
      data: {
        message: data.message,

        userId: user?.id,
        email,
      },
    });

    await sendEmail({
      from: SiteConfig.email.from,
      to: SiteConfig.email.contact,
      subject: `Nouveau feedback de ${email}`,
      text: `Note:\nMessage: ${feedback.message}`,
      replyTo: email,
    });

    // envoyer une notification à l'admin (premier utilisateur admin trouvé)
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (admin) {
      await sendNotificationToUser(
        admin.id,
        NotificationType.FEEDBACK_RECEIVED,
        `nouveau feedback reçu de ${email}`,
      );
    }

    return { message: "Votre feedback a été envoyé à l'assistance." };
  });
