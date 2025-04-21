"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "lucide-react";

export type AddToCalendarButtonProps = {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
};

export function AddToCalendarButton({
  title,
  description,
  startDate,
  endDate,
  location,
}: AddToCalendarButtonProps) {
  // formater les dates
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  // créer url pour google calendar
  const googleUrl = () => {
    const baseUrl = "https://calendar.google.com/calendar/render";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: description,
      location,
    });
    return `${baseUrl}?${params.toString()}`;
  };

  // créer url pour outlook
  const outlookUrl = () => {
    const baseUrl = "https://outlook.live.com/calendar/0/deeplink/compose";
    const params = new URLSearchParams({
      path: "/calendar/action/compose",
      rru: "addevent",
      subject: title,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: description,
      location,
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full sm:w-auto" variant="secondary">
          <Calendar className="size-4 mr-2" />
          ajouter au calendrier
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem asChild>
          <a href={googleUrl()} target="_blank" rel="noopener noreferrer">
            google calendar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={outlookUrl()} target="_blank" rel="noopener noreferrer">
            outlook
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
