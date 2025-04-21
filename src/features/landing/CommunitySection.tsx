import { Button } from "@/components/ui/button";

export function CommunitySection() {
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
            fonctionnalités de Field4U.be : créez votre profil, créer une
            annonce, participer à une annonce, envoyez des photos, et bien plus
            encore.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="secondary">Commencez à Glaner !</Button>
            <Button variant="secondary">Inscrivez vous Gratuitement</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
