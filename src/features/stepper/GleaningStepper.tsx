"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

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
};

export function GleaningStepper({
  className,
  steps = defaultSteps,
  variant = "vertical",
}: GleaningStepperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const maxStepParam = searchParams.get("maxStep");

  // état local pour le rendu
  const [currentStep, setCurrentStep] = useState(
    stepParam ? parseInt(stepParam) : 1,
  );
  const [maxStep, setMaxStep] = useState(
    maxStepParam ? parseInt(maxStepParam) : 1,
  );

  // mettre à jour les états locaux quand les paramètres changent
  useEffect(() => {
    const newStep = stepParam ? parseInt(stepParam) : 1;
    const newMaxStep = maxStepParam ? parseInt(maxStepParam) : 1;

    setCurrentStep(newStep);
    setMaxStep(newMaxStep);
  }, [stepParam, maxStepParam]);

  // déterminer l'étape en fonction du chemin
  useEffect(() => {
    if (
      pathname.includes("/gleaning") &&
      (!stepParam || parseInt(stepParam || "1") < 2)
    ) {
      const params = new URLSearchParams(searchParams);
      params.set("step", "2");

      const currentMaxStep = parseInt(maxStepParam || "1");
      if (currentMaxStep < 2) {
        params.set("maxStep", "2");
      }

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, stepParam, maxStepParam, searchParams, router]);

  const getBaseUrl = () => {
    const basePathParts = pathname.split("/");
    // enlever la dernière partie si nous sommes sur /gleaning
    if (basePathParts[basePathParts.length - 1] === "gleaning") {
      basePathParts.pop();
    }
    return basePathParts.join("/");
  };

  const getStepUrl = (stepNumber: number) => {
    const baseUrl = getBaseUrl();
    const url = stepNumber === 1 ? baseUrl : `${baseUrl}/gleaning`;
    const params = new URLSearchParams();
    params.set("step", stepNumber.toString());

    const newMaxStep = Math.max(maxStep, stepNumber);
    params.set("maxStep", newMaxStep.toString());

    return `${url}?${params.toString()}`;
  };

  const getStepState = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    if (stepId <= maxStep) return "available";
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
          {currentStep < 3 && maxStep >= currentStep && (
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
