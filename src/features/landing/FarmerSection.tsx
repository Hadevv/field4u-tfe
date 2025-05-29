"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Euro, Shield, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export function FarmerSection() {
  const session = useSession();

  return (
    <section className="relative overflow-hidden bg-muted/30">
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
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative aspect-[4/3] w-full max-w-lg">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 blur-3xl" />
                <Image
                  src="/images/agriculture.jpg"
                  alt="Agriculteur dans son champ"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 512px"
                  className="relative rounded-2xl object-cover shadow-2xl"
                />
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center gap-2">
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  vous êtes agriculteur ?
                </p>
              </div>

              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Proposez des denrées encore exploitables
              </h2>

              <p className="mb-8 text-lg text-muted-foreground">
                Vous être agriculteur ? Field4U vous permet de mettre à
                disposition vos denrées encore exploitables sans complexité et{" "}
                <span className="text-muted-foreground">
                  en restant maître du glanage et de vos conditions
                </span>
                .
              </p>

              <div className="mb-8 space-y-6">
                <div className="flex gap-4">
                  <Clock className="mt-1 size-6 shrink-0 text-primary" />
                  <div>
                    <h3 className="text-muted-foreground">Gestion minimale</h3>
                    <p className="text-muted-foreground">
                      Créez une annonce en quelques clics. Vous choisissez le
                      créneau, les règles, et le type de glanage
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Euro className="mt-1 size-6 shrink-0 text-primary" />
                  <div>
                    <h3 className="text-muted-foreground">
                      Soutien financier possible
                    </h3>
                    <p className="text-muted-foreground">
                      Un système de dons peut être activé,{" "}
                      <span className="text-muted-foreground">
                        entièrement pour vous
                      </span>
                      , afin de valoriser votre démarche si vous le souhaitez
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Shield className="mt-1 size-6 shrink-0 text-primary" />
                  <div>
                    <h3 className="text-muted-foreground">Sérénité assurée</h3>
                    <p className="text-muted-foreground">
                      Différents mécanismes sont en place pour{" "}
                      <span className="text-muted-foreground">
                        éviter les mauvaises surprises
                      </span>{" "}
                      : accès limité, notifications, échanges directs avec les
                      participants, etc.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin className="mt-1 size-6 shrink-0 text-primary" />
                  <div>
                    <p className="text-muted-foreground">
                      Vous gardez le contrôle, nous vous simplifions tout le
                      reste
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-4 sm:flex-row">
                {session.data?.user ? (
                  <Button size="sm" asChild>
                    <Link href="/farmer/announcements/create">
                      Proposer un champ maintenant
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" asChild>
                    <Link href="/auth/signin">
                      Inscrivez vous et sélectionnez le rôle agriculteur
                    </Link>
                  </Button>
                )}

                <Button variant="outline" size="sm" asChild>
                  <Link href="/announcements/">
                    Voir les annonces existantes
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
