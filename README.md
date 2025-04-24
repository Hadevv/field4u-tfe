# Field4u – Plateforme de Glanage

## Démarrage Rapide

### Prérequis

- Node.js v21.5.0
- pnpm
- PostgreSQL

### Installation

```bash
git clone https://github.com/arikchakma/maily.to
```

```bash
pnpm install
```

### Configuration

1. Créez un fichier `.env` avec vos variables d'environnement
2. Configurez une base de données [Neon DB](https://neon.tech) (recommandée) ou récuper le dump.sql à la racine du projet
3. Ajoutez l'URL de connexion database dans le fichier `.env` DATABASE_URL="postgresql://user:password@localhost:5432/nom_de_ta_db"
4. Configurez [UploadThing](https://uploadthing.com) pour la gestion des fichiers

### Base de données

- synchroniser le client Prisma avec ton schéma de base de données :

```bash
npx prisma generate
```

- Appliquer les migrations : (modification)

```bash
pnpm prisma migrate dev
```

- Remplir la base de données avec des données de test :

```bash
pnpm seed
```

- Lancer Prisma Studio pour explorer la base de données :

```bash
pnpm prisma studio
```

- Exporter la base de données :

```bash
psql -h pg.neon.tech
pg_dump -h pg.neon.tech -d Field4u -f dump.sql
```

- Importer la base de données :

```bash
pnpm prisma db pull
```

### Utilisateurs par défaut

- Admin: admin@field4u.be (password: password123)
- Utilisateurs Farmer et Gleaner: disponibles dans Prisma Studio avec le même mot de passe (password123)

### Lancer le Projet

```bash
pnpm run dev
```

### Test du Projet

1. Accéder à l'application : http://localhost:3000
2. Créer un compte utilisateur
3. Compléter le processus d'intégration
4. Explorer les fonctionnalités

### Services Additionnels

#### Email

- Configurer MailHog pour les tests d'emails :

```bash
pnpm run mailhog
```

- Lancer le service d'emails avec l'application :

```bash
pnpm run dev:mail
```

#### Inngest (Traitement des tâches en arrière-plan)

```bash
pnpm inngest
```

#### Stripe (Webhooks pour les paiements)

```bash
pnpm stripe-webhooks
```

#### UploadThing (Gestion des fichiers)

- Service configuré pour l'upload d'images et de documents
- Les clés API doivent être ajoutées dans le fichier `.env`

## Déploiement

- L'application est configurée pour être déployée sur [Vercel](https://vercel.com)

## Documentation API

- La documentation de l'API est disponible dans le fichier [docs/api-reference.md](docs/api-reference.md)
- Base URL de l'API : `https://field4u.vercel.app/api/v1`

## Technologies

- Next.js 15
- Prisma
- TailwindCSS
