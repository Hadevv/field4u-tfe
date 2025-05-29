"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function CommunitySection() {
  const session = useSession();
  return (
    <section className="container mx-auto py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-12 lg:p-24">
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
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
            Rejoignez la communauté !
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Inscrivez vous dès maintenant pour accéder à toutes les
            fonctionnalités de Field4U : créez votre profil, créer une annonce,
            participer à une annonce, envoyez des photos de vos glanages, et
            bien plus encore.
          </p>
          <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="sm" asChild>
              <Link href="/announcements/">Commencez à Glaner !</Link>
            </Button>

            {session.data?.user ? (
              <Button
                variant="outline"
                size="sm"
                className="cursor-not-allowed text-base opacity-70"
                disabled
              >
                Vous etes déjà inscrit
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href="/auth/signin">Inscrivez vous Gratuitement</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
