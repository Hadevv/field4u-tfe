"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function HeroSection() {
  const session = useSession();

  return (
    <section className="relative overflow-hidden">
      <div
        className="dot-pattern absolute inset-0"
        style={
          {
            "--dot-color": "hsl(var(--primary)",
            "--dot-background": "transparent",
            "--size": "24px",
          } as React.CSSProperties
        }
      />
      <div className="container mx-auto py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="text-gradient mb-6 bg-gradient-to-r from-primary to-primary/50 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Glaner en Belgique n&apos;a jamais été aussi simple !
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground lg:mx-0">
              Parcourez la carte interactive des champs ouverts au glanage,
              partagez vos découvertes avec d&apos;autres glaneurs et trouvez
              des produits frais près de chez vous.
            </p>
            <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                className="text-base transition-colors hover:bg-primary/90"
                asChild
              >
                <Link href="/announcements/">Commencez à Glaner !</Link>
              </Button>
              {session.data?.user ? (
                <Button
                  variant="outline"
                  className="cursor-not-allowed text-base opacity-70"
                  disabled
                >
                  Déjà inscrit
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="text-base transition-colors hover:bg-accent"
                  asChild
                >
                  <Link href="/auth/signin">S&apos;inscrire</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-lg">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 blur-3xl" />
              <Image
                src="/images/harvest-potatoes.avif"
                alt="Person harvesting potatoes"
                fill
                className="relative rounded-2xl object-cover shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
