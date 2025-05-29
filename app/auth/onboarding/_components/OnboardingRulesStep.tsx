/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { acceptRulesAction } from "../onboarding.action";
import { UserRole } from "@prisma/client";
import { SubmitButton } from "@/features/form/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

type OnboardingRulesStepProps = {
  role: UserRole;
};

export function OnboardingRulesStep({ role }: OnboardingRulesStepProps) {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    try {
      await acceptRulesAction({ rulesAcceptedAt: new Date() });
      toast.success("Règles acceptées avec succès");
      router.push("/");
    } catch (error) {
      toast.error("Échec de l'acceptation des règles");
    }
  };

  const roleLabel = role === "FARMER" ? "Agriculteur" : "Glaneur";
  const roleColor =
    role === "FARMER"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";

  const rules =
    role === "FARMER"
      ? [
          {
            title: "Respectez vos engagements",
            description:
              "Respectez les engagements pris lors de la création du glanage (date, heure, quantité, accès au champ).",
          },
          {
            title: "Préparez l'accueil",
            description:
              "Préparez un accueil minimal (consignes de sécurité, balisage si nécessaire).",
          },
          {
            title: "Signalez les modifications",
            description:
              "Signalez toute modification ou annulation dès que possible via la plateforme.",
          },
          {
            title: "Protection contre le maraudage",
            description:
              "Le lieu du glanage n'est affiché que 24h avant automatiquement pour limiter le maraudage.",
          },
          {
            title: "Courtoisie et respect",
            description:
              "Restez courtois et respectueux envers les glaneurs, même en cas d'imprévus.",
          },
        ]
      : [
          {
            title: "Engagement ferme",
            description:
              "Inscrivez-vous uniquement si vous êtes certain de pouvoir venir.",
          },
          {
            title: "Respectez les consignes",
            description:
              "Respectez les consignes données par le fermier sur place.",
          },
          {
            title: "Ponctualité et responsabilité",
            description:
              "Soyez ponctuel et adoptez un comportement responsable sur le terrain.",
          },
          {
            title: "Usage personnel uniquement",
            description:
              "L'emplacement exact du champ est communiqué 24h avant ; il est strictement interdit d'utiliser les récoltes à des fins commerciales.",
          },
          {
            title: "Propreté des lieux",
            description: "Laissez le champ propre après votre passage.",
          },
        ];

  return (
    <div className="space-y-6">
      {/* Header avec badge du rôle */}
      <div className="text-center space-y-2">
        <Badge className={roleColor}>Règles pour les {roleLabel}s</Badge>
        <p className="text-muted-foreground text-sm">
          Veuillez lire attentivement et accepter ces règles pour finaliser
          votre inscription
        </p>
      </div>

      {/* Liste des règles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Règles de conduite
          </CardTitle>
          <CardDescription>
            Ces règles garantissent une expérience positive pour tous les
            participants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {index + 1}
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{rule.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Note de responsabilité */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <p className="font-medium">
            ℹ️ Vous participez aux glanages sous votre propre responsabilité.
          </p>
          <p>
            Field4U décline toute responsabilité en cas d'accident ou de
            dommage.
          </p>
          <p>
            Consultez les{" "}
            <Link
              href="/legal/terms"
              className="text-primary hover:underline inline-flex items-center gap-1"
              target="_blank"
            >
              Conditions générales d'utilisation
              <ExternalLink className="h-3 w-3" />
            </Link>{" "}
            pour en savoir plus.
          </p>
        </AlertDescription>
      </Alert>

      {/* Boutons d'action */}
      <div className="space-y-3">
        <SubmitButton
          variant="outline"
          onClick={() => setAccepted(true)}
          disabled={accepted}
          className="w-full"
          size="lg"
        >
          {accepted ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Règles acceptées
            </span>
          ) : (
            "Accepter les règles"
          )}
        </SubmitButton>

        {accepted && (
          <SubmitButton onClick={handleAccept} className="w-full" size="lg">
            Finaliser l'inscription
          </SubmitButton>
        )}
      </div>
    </div>
  );
}
