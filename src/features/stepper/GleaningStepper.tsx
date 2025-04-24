"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React from "react";

type GleaningStep = {
  id: number;
  label: string;
  description: string;
};

const defaultSteps: GleaningStep[] = [
  {
    id: 1,
    label: "annonce",
    description: "détails du glanage",
  },
  {
    id: 2,
    label: "glanage",
    description: "joindre le glanage",
  },
  {
    id: 3,
    label: "evaluation",
    description: "évaluation du glanage",
  },
];

type GleaningStepperProps = {
  className?: string;
  steps?: GleaningStep[];
  variant?: "vertical" | "horizontal";
  gleaningStatus?: string;
  isParticipant?: boolean;
};

export function GleaningStepper({
  className,
  steps = defaultSteps,
  variant = "vertical",
  gleaningStatus,
  isParticipant = false,
}: GleaningStepperProps) {
  const pathname = usePathname();

  // déterminer l'étape actuelle basée sur le chemin
  const getCurrentStep = () => {
    if (pathname.includes("/gleaning/review")) return 3;
    if (pathname.includes("/gleaning")) return 2;
    return 1;
  };

  const currentStep = getCurrentStep();

  // vérifier si le glanage est terminé
  const isCompleted = gleaningStatus === "COMPLETED";

  // construire l'URL de base et les URLs des étapes
  const getBaseUrl = () => {
    const pathParts = pathname.split("/");
    // trouver l'index de "announcements" et ajouter 1 pour obtenir l'index du slug
    const slugIndex =
      pathParts.findIndex((part) => part === "announcements") + 1;
    // extraire le slug de l'URL
    const slug = pathParts[slugIndex];

    if (!slug) return "/";
    return `/announcements/${slug}`;
  };

  const getStepUrl = (stepNumber: number) => {
    const baseUrl = getBaseUrl();

    if (stepNumber === 1) return baseUrl;
    if (stepNumber === 2) return `${baseUrl}/gleaning`;
    if (stepNumber === 3) return `${baseUrl}/gleaning/review`;

    return baseUrl;
  };

  const isStepAccessible = (stepId: number) => {
    // si le glanage est terminé, toutes les étapes sont accessibles
    if (isCompleted) return true;

    // l'étape 1 (annonce) est toujours accessible
    if (stepId === 1) return true;

    // l'étape 2 (glanage) est accessible uniquement si l'utilisateur est participant
    if (stepId === 2) return isParticipant;

    // l'étape 3 (évaluation) n'est accessible que si le glanage est terminé
    return false;
  };

  const getStepState = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    if (isStepAccessible(stepId)) return "available";
    return "disabled";
  };

  if (variant === "horizontal") {
    return (
      <div className={cn("w-full p-4", className)}>
        <div className="flex items-center justify-center">
          {steps.map((stepItem, index) => (
            <React.Fragment key={stepItem.id}>
              <Step
                step={stepItem}
                state={getStepState(stepItem.id)}
                url={getStepUrl(stepItem.id)}
                showLabel={false}
              />
              {index < steps.length - 1 && (
                <div
                  className={cn("w-20 h-1", {
                    "bg-primary": stepItem.id < currentStep,
                    "bg-muted": stepItem.id >= currentStep,
                  })}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {currentStep > 1 && (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="flex items-center"
            >
              <Link href={getStepUrl(currentStep - 1)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> étape précédente
              </Link>
            </Button>
          )}
          {currentStep < 3 && isStepAccessible(currentStep + 1) && (
            <div className={cn("ml-auto", { "ml-0": currentStep === 1 })}>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="flex items-center"
              >
                <Link href={getStepUrl(currentStep + 1)}>
                  étape suivante <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-6">étapes</h3>

      <div className="flex flex-col items-start space-y-8 w-full">
        {steps.map((stepItem, index) => (
          <React.Fragment key={stepItem.id}>
            <Step
              step={stepItem}
              state={getStepState(stepItem.id)}
              url={getStepUrl(stepItem.id)}
            />
            {index < steps.length - 1 && (
              <div
                className={cn("w-0.5 h-6 ml-5", {
                  "bg-primary": stepItem.id < currentStep,
                  "bg-muted": stepItem.id >= currentStep,
                })}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

type StepProps = {
  step: GleaningStep;
  state: "completed" | "current" | "available" | "disabled";
  url: string;
  showLabel?: boolean;
};

function Step({ step, state, url, showLabel = true }: StepProps) {
  const getStyles = () => {
    switch (state) {
      case "completed":
        return {
          circle: "bg-primary text-primary-foreground",
          text: "text-foreground",
        };
      case "current":
        return {
          circle: "bg-primary/10 text-primary border-2 border-primary",
          text: "text-foreground",
        };
      case "available":
        return {
          circle: "bg-primary/10 text-primary border-2 border-primary",
          text: "text-foreground",
        };
      default:
        return {
          circle: "bg-muted text-muted-foreground",
          text: "text-muted-foreground",
        };
    }
  };

  const styles = getStyles();
  const isClickable =
    state === "completed" || state === "current" || state === "available";

  const content = (
    <div className="flex items-center w-full">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center font-medium",
          styles.circle,
        )}
      >
        {step.id}
      </div>
      {showLabel && (
        <div className="ml-3 flex flex-col">
          <span className={cn("text-sm font-medium", styles.text)}>
            {step.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {step.description}
          </span>
        </div>
      )}
    </div>
  );

  if (isClickable) {
    return <Link href={url}>{content}</Link>;
  }

  return content;
}
