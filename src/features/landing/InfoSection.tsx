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
              Le glanage est une pratique ancestrale qui consiste à récolter des
              légumes, fruits et autres produits qui restent dans les champs
              après la récolte principale. C&apos;est une manière de réduire le
              gaspillage alimentaire tout en profitant de produits frais et
              locaux.
            </p>
            <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
              <p className="font-medium text-foreground">
                Il est cependant important d&apos;avoir l&apos;accord de
                l&apos;agriculteur !
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Sur Field4U.be, vous pouvez explorer une carte interactive des
              champs ouverts au glanage, partager vos découvertes avec
              d&apos;autres glaneurs et trouver des produits frais près de chez
              vous.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Vous pouvez également ajouter des lieux de glanage, envoyer des
              photos, vérifier les soumissions, etc.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
