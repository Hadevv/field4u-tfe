"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Clock } from "lucide-react";

type GleaningProgressProps = {
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  formattedDate: string;
};

export function GleaningProgress({
  status,
  startDate,
  endDate,
  formattedDate,
}: GleaningProgressProps) {
  // calcul du pourcentage de progression pour la barre
  const getProgressPercentage = () => {
    if (!startDate || !endDate) return 0;

    const now = new Date();
    const total = endDate.getTime() - startDate.getTime();

    if (now < startDate) return 0;
    if (now > endDate) return 100;

    const elapsed = now.getTime() - startDate.getTime();
    return Math.min(Math.round((elapsed / total) * 100), 100);
  };

  // affichage du temps restant
  const calculateTimeRemaining = () => {
    if (!startDate) return null;

    const now = new Date();
    const diff = startDate.getTime() - now.getTime();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}j : ${hours}h : ${minutes}m`;
  };

  const timeRemaining = calculateTimeRemaining();
  const progressPercentage = getProgressPercentage();

  // rendu dela progression
  return (
    <div className="p-3 rounded-lg border border-border bg-card mb-4">
      <div className="flex items-center justify-between mb-2">
        {/* statut du glanage */}
        <div className="flex items-center">
          {status === "IN_PROGRESS" && <Clock className="h-5 w-5 mr-2" />}
          {status === "COMPLETED" && <CheckCircle className="h-5 w-5 mr-2" />}
          {status === "NOT_STARTED" && <Calendar className="h-5 w-5 mr-2" />}

          <span className="font-semibold text-lg">
            {status === "IN_PROGRESS" && "glanage en cours"}
            {status === "COMPLETED" && "glanage terminé"}
            {status === "NOT_STARTED" &&
              (timeRemaining
                ? `commence dans ${timeRemaining}`
                : "date non définie")}
          </span>
        </div>

        {/* bouton d'action selon statut */}
        {status === "IN_PROGRESS" && (
          <Button size="sm" variant="outline" className="text-sm h-7 px-2">
            instructions
          </Button>
        )}
        {status === "COMPLETED" && (
          <Button size="sm" variant="outline" className="text-sm h-7 px-2">
            bilan
          </Button>
        )}
        {startDate && status === "NOT_STARTED" && (
          <div className="text-sm">
            {startDate.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      {/* barre de progression et infos */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>glanage {formattedDate}</span>
        <span>{progressPercentage}% complété</span>
      </div>
      <Progress value={progressPercentage} className="h-1.5 bg-muted mt-1" />
    </div>
  );
}
