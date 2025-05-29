"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { UserRole } from "@prisma/client";
import { OnboardingRoleStep } from "./OnboardingRoleStep";
import { OnboardingFarmerForm } from "./OnboardingFarmerForm";
import { OnboardingGleanerForm } from "./OnboardingGleanerForm";
import { OnboardingRulesStep } from "./OnboardingRulesStep";
import { Logo } from "@/components/svg/Logo";

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  const handleFormSubmit = () => {
    setCurrentStep(3);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <div className="mb-8 flex items-center gap-3">
        <Logo />
      </div>

      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <OnboardingRoleStep onSelect={handleRoleSelect} />
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="mb-4 text-sm text-muted-foreground hover:underline"
              >
                ← Changer de rôle
              </button>

              {selectedRole === "FARMER" ? (
                <OnboardingFarmerForm onSubmit={handleFormSubmit} />
              ) : (
                <OnboardingGleanerForm onSubmit={handleFormSubmit} />
              )}
            </div>
          )}

          {currentStep === 3 && selectedRole && (
            <OnboardingRulesStep role={selectedRole} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
