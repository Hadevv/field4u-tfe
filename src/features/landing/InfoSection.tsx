export function InfoSection() {
  return (
    <section className="container mx-auto py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
          Explorez. Partagez. Récoltez.
        </p>
        <h2 className="mb-12 text-3xl font-bold text-foreground md:text-4xl">
          Qu&apos;est-ce que le glanage ?
        </h2>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Le glanage basé sur une loi de 1886, permet à quiconque de ramasser ce qui reste dans les champs après la récolte principale. Longtemps perçu comme un geste de survie ou de solidarité, il a aujourd’hui une vraie valeur écologique. Dans un contexte où de plus en plus de familles ont du mal à accéder à des produits frais, remettre le glanage au goût du jour devient un acte citoyen.
            </p>
            <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
              <p className="font-medium text-foreground">
                L'application field4u met en relation des agriculteurs et des glaneurs et vous permet de rejoindre un glanage supervisé par l'agriculteur.
                Il est donc important de bien respecter cela et ne pas aller glaner n'importe quel champ car celui-ci peut avoir des pesticides et produits mortants utilisés pour nettoyer son champ.
                Field4u se décharge de toute responsabilité en cas d'accident.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Sur Field4U, vous pouvez explorer une carte interactive, parcourir une liste d'annonces de glanage près de chez vous. Une annonce coup de cœur trouvée ? Vous pouvez la partager avec vos amis et la rejoindre.
              Vous recevez toutes les infos nécessaires pour vous y rendre et rejoindre les autres glaneurs et le fermier sur le champ dans un esprit de respect et de confiance.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
