"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserRole } from "@prisma/client";

type Props = {
  onSelect: (role: UserRole) => void;
};

export function OnboardingRoleStep({ onSelect }: Props) {
  return (
    <section aria-labelledby="role-selection-heading" className="space-y-6">
      <header className="text-center">
        <h2 id="role-selection-heading" className="mb-2 text-2xl font-bold">
          Rejoignez la communauté Field4u
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez votre profil pour commencer l'aventure
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Carte Agriculteur */}
        <article
          role="button"
          onClick={() => onSelect("FARMER")}
          className="group cursor-pointer transition-all"
        >
          <Card className="h-full hover:shadow-lg hover:ring-2 hover:ring-primary">
            <CardContent className="pb-4 pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="text-6xl"></div>
                <h3 className="text-xl font-semibold">Agricole</h3>
                <p className="text-muted-foreground">
                  Je cultive des denrées et souhaite :
                </p>
                <ul className="list-inside list-disc space-y-1 text-left text-sm"></ul>
              </div>
            </CardContent>
          </Card>
        </article>

        {/* Carte Glaneur */}
        <article
          role="button"
          onClick={() => onSelect("GLEANER")}
          className="group cursor-pointer transition-all"
        >
          <Card className="h-full hover:shadow-lg hover:ring-2 hover:ring-primary">
            <CardContent className="pb-4 pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="text-6xl">👥</div>
                <h3 className="text-xl font-semibold">Équipe de Glanage</h3>
                <p className="text-muted-foreground">Nous sommes prêts à :</p>
                <ul className="list-inside list-disc space-y-1 text-left text-sm">
                  <li>Récupérer des surplus agricoles</li>
                  <li>Transformer des denrées en partenariat</li>
                  <li>Sensibiliser contre le gaspillage</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t p-4">
              <Button className="w-full">Choisir ce rôle</Button>
            </CardFooter>
          </Card>
        </article>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Vous représentez une association ou une entreprise ?<br />
        Contactez-nous pour des partenariats à{" "}
        <span className="text-primary">partnership@field4u.be</span>
      </p>
    </section>
  );
}
