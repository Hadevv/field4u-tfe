import Image from "next/image";
import { Calendar, ThumbsUp, ShoppingCart, Car, Hand, Ban } from "lucide-react";

export function RulesSection() {
  return (
    <section className="relative overflow-hidden bg-muted/50">
      <div
        className="dot-pattern absolute inset-0"
        style={
          {
            "--dot-color": "hsl(var(--primary)",
            "--dot-background": "transparent",
            "--size": "16px",
          } as React.CSSProperties
        }
      />
      <div className="container mx-auto py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            Quelques règles à respecter
          </p>
          <h2 className="mb-12 text-3xl font-bold text-foreground md:text-4xl">
            Avant de commencer
          </h2>

          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-12 text-lg text-muted-foreground">
                Pour bien glaner, il est important de respecter quelques règles
                de base. Voici quelques conseils pour glaner en toute sécurité
                et dans le respect de l&apos;environnement.
              </p>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <Calendar className="mt-1 size-6 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    Le glanage se déroule toujours après que la récolte soit
                    totalement achevée, en l&apos;absence de travail ou de
                    machine agricole sur la parcelle, et avant le semis suivant si c'es le cas merci de le signalé.
                  </p>
                </div>

                <div className="flex gap-6">
                  <Ban className="mt-1 size-6 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    Le glanage ne peut en aucun cas se faire sur des parcelles
                    clôturées
                  </p>
                </div>

                <div className="flex gap-6">
                  <Hand className="mt-1 size-6 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    Le glanage ou la cueillette se font à la main (sans matériel
                    lourd)
                  </p>
                </div>

                <div className="flex gap-6">
                  <Car className="mt-1 size-6 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    Il est toujours demandé aux glaneurs ou cueilleurs de ne pas
                    garer leur véhicule sur le champ, de ne pas entraver la
                    circulation locale et des véhicules agricoles ainsi que de
                    respecter les environs
                  </p>
                </div>

                <div className="flex gap-6">
                  <ShoppingCart className="mt-1 size-6 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    Les quantités glanées doivent rester raisonnables et ne pas
                    dépasser l&apos;usage familial normal. En aucun cas, le
                    glanage ne peut se faire dans un but commercial
                  </p>
                </div>

                <div className="flex gap-6">
                  <ThumbsUp className="mt-1 size-6 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    L&apos;agriculteur qui propose son champ est demandé d&apos;être présent un minimum pour accueillir les glaneurs, il vous est donc demandé de vous référer à lui en cas de question
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-lg">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 blur-3xl" />
                <Image
                  src="/images/hands-harvest-corn-in-autumn.jpg"
                  alt="Person harvesting potatoes"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 512px"
                  className="relative rounded-2xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
