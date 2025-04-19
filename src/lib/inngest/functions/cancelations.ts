import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail/sendEmail";
import GleaningCanceledEmail from "@email/GleaningCanceledEmail";
import { getServerUrl } from "@/lib/server-url";

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

      // construire le lien vers la page d'accueil
      const baseUrl = getServerUrl();

      // envoyer les emails d'annulation à tous les participants
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
