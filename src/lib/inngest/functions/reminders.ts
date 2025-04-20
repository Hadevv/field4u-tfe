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

    // calculer le délai
    const now = new Date();
    const gleaningStartDate = new Date(startDate);
    const hoursUntilGleaning = differenceInHours(gleaningStartDate, now);

    // determiner quand envoyer le rappel
    let sendAt: Date;

    if (hoursUntilGleaning > 24) {
      // envoyer 24h avant
      sendAt = addHours(gleaningStartDate, -24);
    } else if (hoursUntilGleaning >= 12) {
      // envoyer 12h avant
      sendAt = addHours(gleaningStartDate, -12);
    } else {
      // trop tard pour envoyer un rappel
      return { success: false, reason: "trop tard pour envoyer un rappel" };
    }
    await step.sleepUntil("wait-until", sendAt.toISOString());

    try {
      const announcement = await step.run("get-announcement", async () => {
        return prisma.announcement.findUnique({
          where: { id: announcementId },
          select: { title: true, slug: true },
        });
      });

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

      // envoyer email de rappel
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
