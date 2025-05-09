import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail/sendEmail";
import GleaningCanceledEmail from "@email/GleaningCanceledEmail";
import { getServerUrl } from "@/lib/server-url";
import { sendNotificationToUser } from "@/lib/notifications/sendNotification";
import { NotificationType } from "@prisma/client";

export const cancelationsFunction = inngest.createFunction(
  { id: "gleaning-cancelations" },
  { event: "glanage.canceled" },
  async ({ event, step }) => {
    const { gleaningId, announcementTitle } = event.data;

    try {
      // récupérer tous les participants du glanage
      const participants = await step.run("get-participants", async () => {
        return prisma.participation.findMany({
          where: { gleaningId },
          select: {
            user: {
              select: {
                email: true,
                id: true,
              },
            },
          },
        });
      });

      if (!participants.length) {
        return {
          success: true,
          emailsSent: 0,
          reason: "aucun participant à notifier",
        };
      }

      // récupérer tous les emails des participants
      const participantEmails = participants
        .map((p) => p.user.email)
        .filter(Boolean) as string[];

      if (!participantEmails.length) {
        return {
          success: true,
          emailsSent: 0,
          reason: "aucun email de participant valide",
        };
      }

      const baseUrl = getServerUrl();

      // envoyer les emails d'annulation a tous les participants
      const results = await step.run("send-cancelation-emails", async () => {
        const emailPromises = participantEmails.map((email) =>
          sendEmail({
            to: email,
            subject: `annulation du glanage: ${announcementTitle}`,
            react: GleaningCanceledEmail({
              announcementTitle,
              homeLink: `${baseUrl}/announcements`,
            }),
          }),
        );
        return Promise.all(emailPromises);
      });

      // envoyer une notification à chaque participant
      for (const participant of participants) {
        if (participant.user?.email) {
          await sendNotificationToUser(
            participant.user.id,
            NotificationType.GLEANING_CANCELED,
            `la session de glanage ${announcementTitle} a été annulée`,
          );
        }
      }

      return {
        success: true,
        emailsSent: results.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "erreur inconnue",
      };
    }
  },
);
