# Guide de la Base de Données

## Configuration initiale

1. Installer les dépendances :

```bash
pnpm install
```

2. Configurer les variables d'environnement :
   Créer un fichier `.env` avec :

```
DATABASE_URL="postgresql://user:password@localhost:5432/glean?schema=public"
```

J'utilise Neon Serverless Postgres qui est 100% free [https://neon.tech/](https://neon.tech/)

3. Créer la base de données :

```bash
pnpm prisma db push
```

## 🌱 Seeding de la base de données

Pour remplir la base de données avec des données de test :

```bash
pnpm run seed
```

## Comptes par défaut

Un compte administrateur est créé automatiquement :

- Email : admin@field4u.be
- Mot de passe : password123
- Rôle : ADMIN

Tous les comptes générés utilisent le même mot de passe : password123

## Structure des données

Le seeder génère :

- 100 utilisateurs (50% agriculteurs, 50% glaneurs)
- Des fermes pour chaque agriculteur
- 1-3 champs par ferme
- Des annonces pour chaque champ
- Des périodes de glanage
- Des participations
- Des avis
- Des likes et favoris
- Des notifications
- Des statistiques
- Des payements

## 🔍 Commandes Prisma utiles

1. Voir la base de données :

```bash
pnpm prisma studio
```

2. Réinitialiser la base de données :

```bash
pnpm prisma migrate reset
```

3. Mettre à jour le schéma :

```bash
pnpm prisma generate
```

## Structure des tables principales

### Users

- Rôles : ADMIN, FARMER, GLEANER
- Plans : FREE, PREMIUM
- Langues : FRENCH, DUTCH, ENGLISH

### Farms

- Liées à un agriculteur
- Contient les informations de localisation
- Peut avoir plusieurs champs

### Fields

- Liés à une ferme
- Contient les coordonnées GPS
- Support pour les données géographiques (PostGIS)

### Announcements

- Liées à un champ
- Contient les informations de glanage
- Système de slug pour les URLs

### Gleanings

- Gestion des sessions de glanage
- Statuts : PENDING, ACCEPTED, COMPLETED, CANCELLED

## Sécurité

- Mots de passe hashés avec bcrypt
- Validation des données avec Prisma
- Contraintes SQL pour l'intégrité des données
