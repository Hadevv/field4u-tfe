import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail/sendEmail";
import GleaningReminderEmail from "@email/GleaningReminderEmail";
import { addHours, differenceInHours } from "date-fns";
import { getServerUrl } from "@/lib/server-url";

export const remindersFunction = inngest.createFunction(
  { id: "gleaning-reminders" },
  { event: "glanage.joined" },
  async ({ event, step }) => {
    const { announcementId, startDate, userId } = event.data;

    // calculer le délai avant le début du glanage
    const now = new Date();
    const gleaningStartDate = new Date(startDate);
    const hoursUntilGleaning = differenceInHours(gleaningStartDate, now);

    // si glanage dans moins de 24h, ne pas envoyer de rappel
    if (hoursUntilGleaning < 1) {
      return { success: false, reason: "trop tard pour envoyer un rappel" };
    }

    // rappel 24h avant le glanage
    const reminderDelay =
      hoursUntilGleaning > 24 ? 24 : Math.max(1, hoursUntilGleaning - 1);
    const sendAt = addHours(now, hoursUntilGleaning - reminderDelay);
    await step.sleepUntil("wait-until", sendAt.toISOString());

    try {
      // récupérer les informations de l'annonce séparément
      const announcement = await step.run("get-announcement", async () => {
        return prisma.announcement.findUnique({
          where: { id: announcementId },
          select: { title: true, slug: true },
        });
      });

      // récupérer les informations de l'utilisateur séparément
      const user = await step.run("get-user", async () => {
        return prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });
      });

      if (!announcement) {
        return {
          success: false,
          reason: "annonce non trouvée pour le rappel",
        };
      }

      if (!user?.email) {
        return {
          success: false,
          reason: "email de l'utilisateur non trouvé pour le rappel",
        };
      }

      const baseUrl = getServerUrl();
      const gleaningLink = `${baseUrl}/announcements/${announcement.slug}/gleaning`;

      // envoyer l'email de rappel
      await step.run("send-reminder-email", async () => {
        await sendEmail({
          to: user.email,
          subject: `rappel pour votre glanage: ${announcement.title}`,
          react: GleaningReminderEmail({
            announcementTitle: announcement.title,
            date: gleaningStartDate,
            gleaningLink,
          }),
        });
      });

      return { success: true, email: user.email };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "erreur inconnue",
      };
    }
  },
);
