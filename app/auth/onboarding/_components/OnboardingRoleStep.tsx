import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { Users } from "lucide-react";
import { Tractor } from "lucide-react";

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
        {/* carte agriculteur */}
        <article
          role="button"
          onClick={() => onSelect("FARMER")}
          className="group cursor-pointer transition-all"
        >
          <Card className="h-full hover:shadow-lg hover:ring-2 hover:ring-primary">
            <CardContent className="pb-4 pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Tractor />
                <h3 className="text-xl font-semibold">Agriculteur</h3>
                <p className="text-muted-foreground">
                  Vous avez un champ, un verger ou un potager ? Je partage mes
                  récoltes
                </p>
              </div>
            </CardContent>
          </Card>
        </article>

        {/* carte glaneur */}
        <article
          role="button"
          onClick={() => onSelect("GLEANER")}
          className="group cursor-pointer transition-all"
        >
          <Card className="h-full hover:shadow-lg hover:ring-2 hover:ring-primary">
            <CardContent className="pb-4 pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Users />
                <h3 className="text-xl font-semibold">Glaneur</h3>
                <p className="text-muted-foreground">
                  Vous souhaitez récupérer des produits frais ? Je glane des
                  produits
                </p>
              </div>
            </CardContent>
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
