# Field4u - Plateforme de Glanage

Field4u est une plateforme web moderne qui connecte les agriculteurs et les glaneurs, facilitant le processus de glanage grâce à une carte interactive et un système d'annonces structuré.

## Fonctionnalités principales

- **Carte interactive** alimentée par Mapbox pour explorer visuellement les champs disponibles
- **Système d'annonces** permettant aux agriculteurs de publier leurs offres de glanage
- **Géolocalisation intelligente** avec révélation progressive des coordonnées pour protéger la vie privée
- **Authentification sécurisée** avec NextAuth.js (Magic Link, Google, GitHub et mot de passe)
- **Onboarding structuré** pour définir le rôle utilisateur (Gleaner ou Farmer)
- **Système de paiements** intégré avec Stripe pour soutenir les agriculteurs
- **API publique sécurisée** pour les intégrations tierces

## Installation et Configuration

### Prérequis

- Node.js v21.5.0 ou supérieur
- pnpm (gestionnaire de packages)
- PostgreSQL avec l'extension PostGIS
- Compte UploadThing pour la gestion des fichiers
- Compte Stripe pour les paiements
- Compte Mapbox pour la carte interactive

### Étapes d'installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd field4u-tfe
pnpm install
```

2. **Configuration de l'environnement**

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/field4u"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-token"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

3. **Configuration de la base de données**

```bash
# Générer le client Prisma
pnpm prisma generate

# Appliquer les migrations de base de données
pnpm prisma migrate dev

# Remplir la base avec des données de test
pnpm seed

# Ouvrir l'interface d'administration de la base (optionnel)
pnpm prisma studio
```

4. **Démarrage du serveur de développement**

```bash
pnpm dev
```

L'application sera accessible sur http://localhost:3000

## Utilisateurs de test

Une fois la base de données initialisée, vous pouvez vous connecter avec ces comptes de test :

- **Admin**: admin@field4u.be / Password123!
- **Agriculteur**: farmer@field4u.be / Password123!
- **Glaneur**: gleaner@field4u.be / Password123!

## Configuration des services externes

### UploadThing (Gestion des fichiers)

1. Créez un compte sur [UploadThing](https://uploadthing.com)
2. Créez une nouvelle application
3. Copiez les clés API dans votre fichier `.env`

### Mapbox (Carte interactive)

1. Créez un compte sur [Mapbox](https://mapbox.com)
2. Générez un token d'accès public
3. Ajoutez-le dans votre fichier `.env`

### Stripe (Paiements - Optionnel)

1. Créez un compte sur [Stripe](https://stripe.com)
2. Récupérez vos clés de test
3. Configurez les webhooks pour `/api/webhooks/stripe`

### Providers OAuth (Optionnel)

#### Google

1. Créez un projet sur [Google Cloud Console](https://console.cloud.google.com)
2. Activez l'API Google+
3. Configurez l'écran de consentement OAuth
4. Créez des identifiants OAuth 2.0

#### GitHub

1. Allez dans Settings > Developer settings > OAuth Apps
2. Créez une nouvelle OAuth App
3. URL d'autorisation : `http://localhost:3000/api/auth/callback/github`

## Utilisation

### Premier démarrage

1. Accédez à http://localhost:3000
2. Créez un compte ou connectez-vous avec les comptes de test
3. Complétez le processus d'onboarding pour définir votre rôle
4. Explorez les fonctionnalités selon votre rôle

### Pour les agriculteurs

1. Créez vos fermes et vos champs
2. Publiez des annonces de glanage
3. Gérez les participations
4. Suivez les statistiques

### Pour les glaneurs

1. Explorez la carte des annonces disponibles
2. Filtrez par proximité, type de culture, etc.
3. Rejoignez les glanages qui vous intéressent
4. Laissez des avis après participation

## API Publique

Field4u propose une API REST sécurisée pour les intégrations tierces.

### Base URL

```
https://field4u.vercel.app/api/v1
```

### Endpoints principaux

- `GET /announcements` - Liste des annonces avec géolocalisation
- `GET /crop-types` - Types de cultures disponibles
- `GET /gleanings/{id}/reviews` - Avis des glanages terminés
- `POST /gleanings/join` - Rejoindre un glanage (authentifié)
- `GET /profile` - Profil utilisateur (authentifié)

Documentation complète : [docs/api-reference.md](docs/api-reference.md)

## Tests

### Tests unitaires (Vitest)

```bash
# Lancer les tests
pnpm test

# Interface graphique
pnpm test:ui
```

### Tests end-to-end (Playwright)

```bash
# Installation des navigateurs
npx playwright install

# Lancer les tests E2E
pnpm test:e2e

# Interface graphique pour débugger
pnpm test:e2e-ui

# Mode debug
pnpm test:e2e-debug
```

## Technologies utilisées

### Frontend

- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité de type
- **TailwindCSS + Shadcn/UI** pour le design
- **Mapbox** pour la cartographie
- **React Hook Form** pour la gestion des formulaires

### Backend

- **Prisma** avec PostgreSQL + PostGIS
- **NextAuth.js** pour l'authentification
- **UploadThing** pour la gestion des fichiers
- **Stripe** pour les paiements
- **Zod** pour la validation des données
- **Resend** pour l'envoi de mails

### Tests

- **Vitest** pour les tests unitaires
- **Playwright** pour les tests E2E

\*\* pour la validation des données

-

### Développement

- **Vitest** pour les tests unitaires
- **Playwright** pour les tests E2E
- **ESLint + Prettier** pour la qualité du code

## Déploiement

### Vercel (Recommandé)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Base de données

Utilisez [Neon](https://neon.tech) pour une base PostgreSQL gérée avec PostGIS.

## Dépannage

### Problèmes courants

**Erreur de connexion à la base de données**

- Vérifiez votre `DATABASE_URL`
- Assurez-vous que PostgreSQL est démarré
- Vérifiez que l'extension PostGIS est installée

**Problèmes d'authentification**

- Vérifiez votre `NEXTAUTH_SECRET`
- Assurez-vous que `NEXTAUTH_URL` est correct

**Problèmes de cartes**

- Vérifiez votre token Mapbox
- Assurez-vous que le token est public

### Logs

Consultez les logs du serveur pour diagnostiquer les problèmes :

```bash
pnpm dev  # Les erreurs s'affichent dans la console
```

## Support

- **Documentation API** : [docs/api-reference.md](docs/api-reference.md)
- **Tests API** : [app/api/v1/test-api-requests.md](app/api/v1/test-api-requests.md)
- **Issues** : Utilisez le système d'issues GitHub du projet
