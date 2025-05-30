# API Field4u v1 - Documentation Technique Complète

## Vue d'ensemble

L'API Field4u v1 est une API publique RESTful sécurisée conçue pour permettre aux développeurs d'applications mobiles et aux intégrations tierces d'interagir avec la plateforme de glanage. Elle offre un accès aux données publiques tout en protégeant rigoureusement la vie privée des utilisateurs.

## Caractéristiques de sécurité

### Protection avancée des données

- **Géolocalisation intelligente** avec révélation progressive des coordonnées GPS
- **IDs anonymisés** pour éviter l'énumération des ressources
- **Validation stricte** de tous les paramètres avec Zod
- **Rate limiting** pour prévenir les abus
- **Données personnelles protégées** (emails, téléphones, adresses)

### Conformité et standards

- **RGPD compliant** pour la protection des données européennes
- **REST API** suivant les conventions standards
- **Format JSON** pour tous les échanges
- **Codes de statut HTTP** appropriés
- **Headers de sécurité** configurés

## Architecture de l'API

### Structure des endpoints

```
/api/v1/
├── announcements/                    # Annonces publiques avec géolocalisation
│   ├── GET /                        # Liste paginée avec filtres et recherche
│   └── GET /{id}/                   # Détails d'une annonce spécifique
├── crop-types/                      # Types de cultures disponibles
│   └── GET /                        # Liste avec filtres par catégorie/saison
├── gleanings/                       # Gestion des sessions de glanage
│   ├── POST /join/                  # Rejoindre un glanage (authentifié)
│   ├── DELETE /join/                # Quitter un glanage (authentifié)
│   └── GET /{id}/reviews/           # Avis d'un glanage terminé
└── profile/                         # Profil utilisateur public
    ├── GET /                        # Consulter profil (authentifié)
    └── PATCH /                      # Modifier profil (authentifié)
```

### Base URL et versioning

**Production :**

```
https://field4u.vercel.app/api/v1
```

**Développement :**

```
http://localhost:3000/api/v1
```

La version est incluse dans l'URL pour assurer la rétrocompatibilité lors des évolutions futures.

## Authentification et Autorisation

### Système d'authentification

L'API utilise le système d'authentification NextAuth.js basé sur les cookies de session :

- **Endpoints publics** : Aucune authentification requise
- **Endpoints protégés** : Session utilisateur valide requise
- **Cookies sécurisés** : HTTPOnly, Secure, SameSite configurés

### Flux d'authentification

1. **Connexion** via `/api/auth/signin`
2. **Session automatique** maintenue par cookies
3. **Vérification** via middleware NextAuth
4. **Déconnexion** via `/api/auth/signout`

### Endpoints d'authentification

| Endpoint                | Description                  | Type    |
| ----------------------- | ---------------------------- | ------- |
| `GET /api/auth/signin`  | Page de connexion            | Public  |
| `GET /api/auth/signout` | Déconnexion                  | Public  |
| `GET /api/auth/session` | Vérifier session             | Public  |
| `GET /api/session`      | Session interne (middleware) | Interne |

## Géolocalisation Intelligente

### Principe de révélation progressive

La protection de la vie privée est assurée par un système de révélation progressive des coordonnées GPS :

**Phase 1 - Plus de 24h avant le glanage :**

- Ville et code postal visibles
- Coordonnées GPS masquées
- `locationRevealed: false`

**Phase 2 - Moins de 24h avant le début :**

- Coordonnées GPS exactes révélées
- Localisation précise accessible
- `locationRevealed: true`

### Calculs géographiques

L'API utilise PostGIS pour les calculs de distance :

```sql
-- Exemple de requête PostGIS utilisée
SELECT *, ST_Distance(
  ST_GeogFromWKB(ST_GeomFromText('POINT(lng lat)', 4326)),
  ST_GeogFromWKB(coordinates)
) as distance_meters
FROM fields
WHERE ST_DWithin(
  ST_GeogFromWKB(coordinates),
  ST_GeogFromWKB(ST_GeomFromText('POINT(lng lat)', 4326)),
  radius_in_meters
);
```

### Limites géographiques

- **Rayon de recherche** : 1 à 50 kilomètres maximum
- **Coordonnées valides** : Latitude -90 à 90, Longitude -180 à 180
- **Système de référence** : WGS84 (EPSG:4326)

## Endpoints Détaillés

### 1. Annonces (`/api/v1/announcements/`)

#### GET /announcements

Récupère la liste des annonces publiques avec géolocalisation intelligente.

**Paramètres de requête :**

| Paramètre  | Type    | Obligatoire | Description             | Contraintes             |
| ---------- | ------- | ----------- | ----------------------- | ----------------------- |
| `page`     | integer | Non         | Numéro de page          | 1-100, défaut: 1        |
| `limit`    | integer | Non         | Éléments par page       | 1-50, défaut: 10        |
| `search`   | string  | Non         | Recherche textuelle     | Max 100 caractères      |
| `city`     | string  | Non         | Filtrer par ville       | Max 100 caractères      |
| `cropType` | string  | Non         | ID du type de culture   | UUID valide             |
| `lat`      | float   | Non         | Latitude utilisateur    | -90 à 90                |
| `lng`      | float   | Non         | Longitude utilisateur   | -180 à 180              |
| `radius`   | integer | Non         | Rayon de recherche (km) | 1-50, requis si lat/lng |

**Exemple de réponse :**

```json
{
  "data": [
    {
      "id": "abc12345...",
      "title": "Récolte de pommes bio dans notre verger familial",
      "description": "Venez glaner des pommes biologiques dans notre verger centenaire. Parfait pour les familles avec enfants.",
      "quantityAvailable": 200,
      "unit": "kg",
      "startDate": "2024-01-15T09:00:00.000Z",
      "endDate": "2024-01-15T17:00:00.000Z",
      "suggestedPrice": 5.0,
      "currency": "EUR",
      "participantsCount": 8,
      "maxParticipants": 20,
      "status": "ACTIVE",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "field": {
        "id": "def67890...",
        "name": "Verger du soleil levant",
        "city": "Namur",
        "postalCode": "5000",
        "surface": 2.5,
        "surfaceUnit": "hectares",
        "latitude": 50.4673,
        "longitude": 4.8719,
        "locationRevealed": true,
        "coordinates": [4.8719, 50.4673]
      },
      "cropType": {
        "id": "ghi01234...",
        "name": "Pomme",
        "category": "FRUIT",
        "season": "FALL",
        "harvestPeriod": "September - November"
      },
      "owner": {
        "id": "jkl56789...",
        "name": "Ferme Dupont & Fils",
        "verified": true,
        "memberSince": "2023"
      }
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "searchRadius": 15,
    "userLocation": {
      "lat": 50.8503,
      "lng": 4.3517,
      "city": "Bruxelles"
    }
  }
}
```

#### GET /announcements/{id}

Récupère les détails d'une annonce spécifique.

**Paramètres :**

- `id` (string, path) : Identifiant de l'annonce

**Codes de réponse :**

- `200` : Succès
- `404` : Annonce non trouvée

### 2. Types de Cultures (`/api/v1/crop-types/`)

#### GET /crop-types

Liste des types de cultures avec filtres disponibles.

**Paramètres :**

| Paramètre  | Type    | Description       | Valeurs possibles                        |
| ---------- | ------- | ----------------- | ---------------------------------------- |
| `category` | enum    | Catégorie         | VEGETABLE, FRUIT, GRAIN, HERB            |
| `season`   | enum    | Saison            | SPRING, SUMMER, FALL, WINTER, YEAR_ROUND |
| `page`     | integer | Numéro de page    | 1-100                                    |
| `limit`    | integer | Éléments par page | 1-50                                     |

**Exemple de réponse :**

```json
{
  "data": [
    {
      "id": "crop_001...",
      "name": "Pomme",
      "scientificName": "Malus domestica",
      "category": "FRUIT",
      "season": "FALL",
      "harvestPeriod": "September - November",
      "description": "Fruit à pépins cultivé principalement en automne",
      "varieties": ["Gala", "Golden", "Granny Smith"],
      "nutritionalBenefits": ["Vitamine C", "Fibres", "Antioxydants"],
      "storageAdvice": "Conservation possible 2-3 mois au frais",
      "cookingTips": ["Compote", "Tarte", "Jus frais"],
      "seasonalAvailability": {
        "peak": "October",
        "start": "September",
        "end": "November"
      }
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "categoriesCount": {
      "FRUIT": 15,
      "VEGETABLE": 25,
      "GRAIN": 3,
      "HERB": 2
    }
  }
}
```

### 3. Glanages (`/api/v1/gleanings/`)

#### POST /gleanings/join

Permet à un utilisateur authentifié de rejoindre un glanage.

**Authentification :** Requise

**Corps de la requête :**

```json
{
  "gleaningId": "real_gleaning_uuid"
}
```

**Validation :**

- L'utilisateur ne peut pas rejoindre ses propres glanages
- Le glanage doit être ouvert aux participations
- Limite de participants non atteinte
- Pas de participation existante

**Exemple de réponse :**

```json
{
  "success": true,
  "message": "Vous avez rejoint le glanage avec succès",
  "data": {
    "participationId": "part_123...",
    "gleaningTitle": "Récolte de pommes bio",
    "startDate": "2024-01-15T09:00:00.000Z",
    "location": "Ferme Dupont, Namur",
    "participantsCount": 9,
    "maxParticipants": 20
  }
}
```

#### DELETE /gleanings/join

Permet de quitter un glanage rejoint précédemment.

**Authentification :** Requise

**Corps de la requête :**

```json
{
  "gleaningId": "real_gleaning_uuid"
}
```

#### GET /gleanings/{id}/reviews

Récupère les avis d'un glanage terminé.

**Restriction :** Disponible uniquement pour les glanages avec statut `COMPLETED`

**Exemple de réponse :**

```json
{
  "data": [
    {
      "id": "review_001...",
      "rating": 5,
      "content": "Excellente expérience de glanage ! L'organisateur était très accueillant et nous a fourni tous les outils nécessaires.",
      "createdAt": "2024-01-20",
      "helpful": true,
      "reviewer": {
        "name": "Marie Dupont",
        "participationsCount": 12,
        "verified": true
      },
      "response": {
        "content": "Merci beaucoup Marie ! Nous avons été ravis de vous accueillir.",
        "createdAt": "2024-01-21",
        "author": "Ferme Dupont"
      }
    }
  ],
  "meta": {
    "total": 8,
    "averageRating": 4.6,
    "ratingsDistribution": {
      "5": 6,
      "4": 1,
      "3": 1,
      "2": 0,
      "1": 0
    },
    "gleaning": {
      "id": "gleaning_001...",
      "title": "Récolte de pommes bio",
      "status": "COMPLETED",
      "completedAt": "2024-01-15T17:00:00.000Z",
      "totalParticipants": 15,
      "quantityHarvested": 180
    }
  }
}
```

### 4. Profil Utilisateur (`/api/v1/profile/`)

#### GET /profile

Récupère le profil public de l'utilisateur connecté.

**Authentification :** Requise

**Exemple de réponse :**

```json
{
  "data": {
    "id": "user_001...",
    "name": "Jean Dupont",
    "bio": "Passionné de jardinage et de circuits courts",
    "city": "Bruxelles",
    "memberSince": "2023-06-15",
    "verified": true,
    "role": "GLEANER",
    "stats": {
      "participationsCount": 12,
      "reviewsGiven": 8,
      "averageRatingGiven": 4.2,
      "favoritesCrops": ["Pomme", "Tomate", "Carotte"],
      "totalDistanceTraveled": 145
    },
    "preferences": {
      "maxTravelDistance": 25,
      "favoriteCropTypes": ["FRUIT", "VEGETABLE"],
      "preferredDays": ["SATURDAY", "SUNDAY"],
      "notifications": {
        "email": true,
        "push": false
      }
    },
    "achievements": [
      {
        "name": "Premier glanage",
        "description": "Participation au premier glanage",
        "unlockedAt": "2023-06-20"
      }
    ]
  }
}
```

#### PATCH /profile

Modifie le profil public de l'utilisateur.

**Authentification :** Requise

**Corps de la requête :**

```json
{
  "name": "Nouveau nom",
  "bio": "Nouvelle biographie",
  "city": "Nouvelle ville",
  "preferences": {
    "maxTravelDistance": 30,
    "favoriteCropTypes": ["FRUIT"]
  }
}
```

## Validation et Contraintes

### Validation des paramètres

Tous les paramètres sont validés avec Zod selon ces règles :

```typescript
// Paramètres de pagination
const paginationSchema = z.object({
  page: z.number().int().min(1).max(100).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

// Paramètres géographiques
const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().int().min(1).max(50),
});

// Paramètres de recherche
const searchSchema = z.object({
  search: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  cropType: z.string().uuid().optional(),
});
```

### Limites de taille des réponses

- **Maximum 50 éléments** par page
- **IDs tronqués** à 8 caractères + "..."
- **Données optimisées** pour réduire la bande passante
- **Compression gzip** automatique

### Rate Limiting

| Type d'endpoint | Limite        | Période                 |
| --------------- | ------------- | ----------------------- |
| Publics         | 100 requêtes  | Par minute / IP         |
| Authentifiés    | 1000 requêtes | Par heure / utilisateur |
| Recherche géo   | 50 requêtes   | Par minute / IP         |

## Codes d'Erreur et Gestion

### Codes de statut HTTP standard

| Code  | Signification        | Cas d'usage                                |
| ----- | -------------------- | ------------------------------------------ |
| `200` | Succès               | Requête traitée avec succès                |
| `201` | Créé                 | Ressource créée (rejoindre glanage)        |
| `400` | Requête incorrecte   | Paramètres invalides ou manquants          |
| `401` | Non authentifié      | Session expirée ou manquante               |
| `403` | Non autorisé         | Permissions insuffisantes                  |
| `404` | Non trouvé           | Ressource inexistante                      |
| `409` | Conflit              | Action déjà effectuée ou impossible        |
| `422` | Entité non traitable | Données valides mais traitement impossible |
| `429` | Trop de requêtes     | Rate limiting activé                       |
| `500` | Erreur serveur       | Erreur interne                             |

### Format des erreurs

```json
{
  "error": true,
  "message": "Description claire de l'erreur",
  "status": 400,
  "code": "INVALID_PARAMETERS",
  "details": {
    "field": "radius",
    "value": 100,
    "constraint": "maximum 50 km"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/announcements",
  "suggestion": "Utilisez un rayon entre 1 et 50 kilomètres"
}
```

## Sécurité en Production

### Headers de sécurité

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### Protection CORS

```javascript
const corsOptions = {
  origin: [
    "https://field4u.vercel.app",
    "https://field4u.app",
    process.env.NODE_ENV === "development" && "http://localhost:3000",
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

### Monitoring et Logs

- **Logs d'accès** : Toutes les requêtes API
- **Logs d'erreurs** : Erreurs 4xx et 5xx
- **Métriques** : Temps de réponse, taux d'erreur
- **Alertes** : Rate limiting, erreurs critiques

## Développement Local

### Prérequis techniques

- Node.js v21.5.0 ou supérieur
- pnpm v8.0.0 ou supérieur
- PostgreSQL 15+ avec PostGIS 3.3+
- Variables d'environnement configurées

### Configuration de la base de données

```sql
-- Extensions requises
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Vérification PostGIS
SELECT PostGIS_Version();
```

### Variables d'environnement

```env
# Base de données avec PostGIS
DATABASE_URL="postgresql://user:password@localhost:5432/field4u"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (files)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# Mapbox (cartes)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.ey..."

# Stripe (paiements - optionnel)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OAuth providers (optionnel)
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-secret"
GITHUB_ID="github-client-id"
GITHUB_SECRET="github-secret"
```

### Installation et lancement

```bash
# Clone et installation
git clone <repository>
cd field4u-tfe
pnpm install

# Configuration base de données
pnpm prisma generate
pnpm prisma migrate dev
pnpm seed

# Lancement serveur dev
pnpm dev

# Tests API
curl http://localhost:3000/api/v1/crop-types
curl "http://localhost:3000/api/v1/announcements?city=Namur"
```

## Tests et Validation

### Tests unitaires

```bash
# Tests avec Vitest
pnpm test

# Tests en mode watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Tests d'intégration API

```bash
# Tests E2E avec Playwright
pnpm test:e2e

# Tests API spécifiques
pnpm test:api
```

### Tests de charge

```bash
# Tests avec k6 (exemple)
k6 run tests/load/api-announcements.js
```

## Évolutions Futures

### Version 1.1 (Planifiée)

- **WebSockets** pour notifications temps réel
- **GraphQL** endpoint pour queries complexes
- **Caching avancé** avec Redis
- **Authentification API Key** pour intégrations

### Version 2.0 (Roadmap)

- **API mobile native** optimisée
- **Microservices** architecture
- **Multi-tenant** support
- **Analytics** et reporting avancés

## Support et Documentation

### Ressources disponibles

- **Guide utilisateur** : [README.md](../../../README.md)
- **Tests API** : [test-api-requests.md](test-api-requests.md)
- **Documentation complète** : [docs/api-reference.md](../../../docs/api-reference.md)

### Contact et assistance

- **Issues GitHub** : Repository principal
- **Documentation** : Inline dans le code
- **Support communautaire** : Via la plateforme Field4u
