"use client";

import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";
import Image from "next/image";
export function getGoogleCalendarUrl({
  title,
  description,
  startDate,
  endDate,
  location,
}: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
}) {
  const format = (date: Date) => date.toISOString().replace(/-|:|\..+/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${format(startDate)}/${format(endDate)}`,
    details: description,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl({
  title,
  description,
  startDate,
  endDate,
  location,
}: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
}) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: description,
    location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function showAddToCalendarDialog({
  title,
  description,
  startDate,
  endDate,
  location,
}: {
  announcementId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
}) {
  const dialogId = dialogManager.add({
    title: "ajouter au calendrier",
    description: (
      <>
        <p className="text-center text-muted-foreground mb-4">
          voulez-vous ajouter ce glanage à votre calendrier ?
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            className="w-full h-9 rounded-md border border-input text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition bg-background"
            onClick={() =>
              window.open(
                getGoogleCalendarUrl({
                  title,
                  description,
                  startDate,
                  endDate,
                  location,
                }),
                "_blank",
              )
            }
            type="button"
          >
            <Image
              src="/images/google-calendar.png"
              alt="google calendar"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            google calendar
          </button>
          <button
            className="w-full h-9 rounded-md border border-input text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition bg-background"
            onClick={() =>
              window.open(
                getOutlookCalendarUrl({
                  title,
                  description,
                  startDate,
                  endDate,
                  location,
                }),
                "_blank",
              )
            }
            type="button"
          >
            <Image
              src="/images/ms-outlook-svgrepo-com.svg"
              alt="outlook"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            outlook
          </button>
        </div>
      </>
    ),
    style: "centered",
    cancel: {
      label: "non merci",
      onClick: () => dialogManager.remove(dialogId),
    },
  });
}
