# API Field4u v1 - Documentation Complète

## Introduction

L'API Field4u v1 est une API publique RESTful sécurisée conçue pour les applications mobiles et les intégrations tierces. Elle permet d'interagir avec la plateforme de glanage tout en protégeant la vie privée des utilisateurs.

## Base URL

**Production :**

```
https://field4u.vercel.app/api/v1
```

**Développement :**

```
http://localhost:3000/api/v1
```

## Authentification

L'API utilise l'authentification basée sur les cookies de session NextAuth. Pour les endpoints protégés, l'utilisateur doit être authentifié via l'interface web.

**Endpoints d'authentification :**

- `GET /api/auth/signin` - Page de connexion
- `GET /api/auth/signout` - Déconnexion
- `GET /api/auth/session` - Vérifier la session

## Sécurité et Protection des Données

### Fonctionnalités de sécurité

- **Géolocalisation intelligente** : Révélation progressive des coordonnées 24h avant le glanage
- **IDs anonymisés** : Format `abc12345...` pour éviter l'énumération des ressources
- **Validation stricte** : Tous les paramètres validés avec Zod
- **Rate limiting** : Limitations de requêtes pour éviter les abus
- **Données protégées** : Seules les informations nécessaires sont exposées

### Données non exposées

- Coordonnées GPS précises des champs (sauf 24h avant le glanage)
- Emails et téléphones des utilisateurs
- Adresses complètes des exploitations
- IDs complets pour éviter l'énumération
- Images de profil des utilisateurs

## Endpoints - Vue d'ensemble

| Catégorie    | Méthode  | Endpoint                  | Description                | Auth   | Paramètres                                                |
| ------------ | -------- | ------------------------- | -------------------------- | ------ | --------------------------------------------------------- |
| **Annonces** | `GET`    | `/announcements`          | Liste avec géolocalisation | Public | `lat`, `lng`, `radius`, `search`, `city`, `page`, `limit` |
| **Annonces** | `GET`    | `/announcements/{id}`     | Détails d'une annonce      | Public | -                                                         |
| **Cultures** | `GET`    | `/crop-types`             | Types de cultures          | Public | `category`, `season`, `page`, `limit`                     |
| **Glanages** | `POST`   | `/gleanings/join`         | Rejoindre un glanage       | Auth   | `gleaningId`                                              |
| **Glanages** | `DELETE` | `/gleanings/join`         | Quitter un glanage         | Auth   | `gleaningId`                                              |
| **Avis**     | `GET`    | `/gleanings/{id}/reviews` | Avis d'un glanage terminé  | Public | `page`, `limit`                                           |
| **Profil**   | `GET`    | `/profile`                | Profil public utilisateur  | Auth   | -                                                         |
| **Profil**   | `PATCH`  | `/profile`                | Modifier profil            | Auth   | `name`, `bio`, `city`                                     |

## Détails des Endpoints

### Annonces

#### GET /announcements

Liste des annonces publiques avec géolocalisation intelligente.

**Paramètres :**

| Paramètre  | Type   | Obligatoire | Description              | Limites            |
| ---------- | ------ | ----------- | ------------------------ | ------------------ |
| `page`     | number | Non         | Numéro de page           | 1-100, défaut: 1   |
| `limit`    | number | Non         | Éléments par page        | 1-50, défaut: 10   |
| `search`   | string | Non         | Recherche textuelle      | Max 100 caractères |
| `city`     | string | Non         | Filtrer par ville        | Max 100 caractères |
| `cropType` | string | Non         | ID du type de culture    | -                  |
| `lat`      | number | Non         | Latitude utilisateur     | -90 à 90           |
| `lng`      | number | Non         | Longitude utilisateur    | -180 à 180         |
| `radius`   | number | Non         | Rayon de recherche en km | 1-50               |

**Exemple de requête :**

```bash
curl "https://field4u.vercel.app/api/v1/announcements?lat=50.8503&lng=4.3517&radius=15&search=pomme"
```

**Réponse :**

```json
{
  "data": [
    {
      "id": "abc12345...",
      "title": "Récolte de pommes bio",
      "description": "Venez glaner des pommes dans notre verger bio...",
      "quantityAvailable": 200,
      "startDate": "2024-01-15T09:00:00Z",
      "endDate": "2024-01-15T17:00:00Z",
      "suggestedPrice": 5.0,
      "createdAt": "2024-01-01T12:00:00Z",
      "field": {
        "id": "def67890...",
        "name": "Verger du soleil",
        "city": "Namur",
        "postalCode": "5000",
        "surface": 2.5,
        "latitude": 50.4673,
        "longitude": 4.8719,
        "locationRevealed": true
      },
      "cropType": {
        "id": "ghi01234...",
        "name": "Pomme",
        "category": "FRUIT",
        "season": "FALL"
      },
      "owner": {
        "id": "jkl56789...",
        "name": "Ferme Dupont"
      }
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "searchRadius": 15,
    "userLocation": { "lat": 50.8503, "lng": 4.3517 }
  }
}
```

#### GET /announcements/{id}

Détails d'une annonce spécifique.

**Paramètres :**

- `id` (string) : ID de l'annonce

**Exemple :**

```bash
curl "https://field4u.vercel.app/api/v1/announcements/abc12345..."
```

### Types de Cultures

#### GET /crop-types

Liste des types de cultures disponibles.

**Paramètres :**

| Paramètre  | Type   | Description          | Valeurs possibles                        |
| ---------- | ------ | -------------------- | ---------------------------------------- |
| `category` | enum   | Catégorie de culture | VEGETABLE, FRUIT                         |
| `season`   | enum   | Saison de culture    | SPRING, SUMMER, FALL, WINTER, YEAR_ROUND |
| `page`     | number | Numéro de page       | 1-100                                    |
| `limit`    | number | Éléments par page    | 1-50                                     |

**Exemple :**

```bash
curl "https://field4u.vercel.app/api/v1/crop-types?category=FRUIT&season=FALL"
```

### Glanages

#### POST /gleanings/join

Rejoindre un glanage (authentification requise).

**Corps de la requête :**

```json
{
  "gleaningId": "real_gleaning_id"
}
```

**Exemple :**

```bash
curl -X POST -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"gleaningId": "real_gleaning_id"}' \
  "https://field4u.vercel.app/api/v1/gleanings/join"
```

**Réponse :**

```json
{
  "success": true,
  "message": "Vous avez rejoint le glanage avec succès",
  "participationId": "mno78901..."
}
```

#### DELETE /gleanings/join

Quitter un glanage (authentification requise).

**Corps de la requête :**

```json
{
  "gleaningId": "real_gleaning_id"
}
```

#### GET /gleanings/{id}/reviews

Avis d'un glanage terminé uniquement.

**Exemple :**

```bash
curl "https://field4u.vercel.app/api/v1/gleanings/gleaning_id/reviews"
```

**Réponse :**

```json
{
  "data": [
    {
      "id": "pqr12345...",
      "rating": 5,
      "content": "Excellente expérience de glanage ! Organisateur très sympa.",
      "createdAt": "2024-01-20",
      "reviewer": {
        "name": "Marie Dupont"
      }
    }
  ],
  "meta": {
    "total": 8,
    "averageRating": 4.6,
    "gleaningStatus": "COMPLETED",
    "gleaningTitle": "Récolte de pommes bio"
  }
}
```

### Profil Utilisateur

#### GET /profile

Profil public de l'utilisateur connecté.

**Exemple :**

```bash
curl -b cookies.txt "https://field4u.vercel.app/api/v1/profile"
```

#### PATCH /profile

Modifier le profil public.

**Corps de la requête :**

```json
{
  "name": "Nouveau Nom",
  "bio": "Ma nouvelle bio",
  "city": "Bruxelles"
}
```

## Géolocalisation Intelligente

### Principe de révélation progressive

La géolocalisation suit un système de révélation progressive pour protéger la vie privée :

1. **Plus de 24h avant le glanage** : Seules la ville et le code postal sont visibles
2. **Moins de 24h avant le début** : Les coordonnées GPS exactes sont révélées
3. **Recherche géographique** : Limitée à un rayon maximum de 50km

### Exemples d'usage

**Recherche par proximité :**

```bash
# Recherche dans un rayon de 20km autour de Bruxelles
curl "https://field4u.vercel.app/api/v1/announcements?lat=50.8503&lng=4.3517&radius=20"
```

**Recherche combinée :**

```bash
# Recherche de pommes dans un rayon de 15km
curl "https://field4u.vercel.app/api/v1/announcements?lat=50.8503&lng=4.3517&radius=15&search=pomme"
```

## Cas d'Usage Typiques

### 1. Application mobile de glanage

```javascript
// Obtenir la géolocalisation de l'utilisateur
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;

  // Rechercher les glanages à proximité
  const response = await fetch(
    `/api/v1/announcements?lat=${latitude}&lng=${longitude}&radius=25&limit=20`,
  );

  const data = await response.json();
  // Afficher les résultats sur une carte
});
```

### 2. Système de notifications

```javascript
// Rejoindre un glanage
const joinGleaning = async (gleaningId) => {
  const response = await fetch("/api/v1/gleanings/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gleaningId }),
    credentials: "include", // Important pour les cookies
  });

  if (response.ok) {
    const result = await response.json();
    console.log(result.message);
  }
};
```

### 3. Widget d'avis

```javascript
// Afficher les avis d'un glanage terminé
const loadReviews = async (gleaningId) => {
  const response = await fetch(`/api/v1/gleanings/${gleaningId}/reviews`);
  const data = await response.json();

  // Afficher la note moyenne et les commentaires
  console.log(`Note moyenne: ${data.meta.averageRating}/5`);
  data.data.forEach((review) => {
    console.log(`${review.reviewer.name}: ${review.content}`);
  });
};
```

## Validation et Limites

### Paramètres de pagination

- `page` : 1 à 100 (défaut: 1)
- `limit` : 1 à 50 (défaut: 10)

### Paramètres de géolocalisation

- `lat` : -90 à 90 (latitude valide)
- `lng` : -180 à 180 (longitude valide)
- `radius` : 1 à 50 km (rayon de recherche)

### Paramètres de recherche

- `search` : Maximum 100 caractères
- `city` : Maximum 100 caractères

## Codes d'Erreur

| Code  | Description           | Exemple                            |
| ----- | --------------------- | ---------------------------------- |
| `400` | Requête incorrecte    | Paramètres manquants ou invalides  |
| `401` | Non authentifié       | Session expirée, connexion requise |
| `403` | Non autorisé          | Accès refusé à la ressource        |
| `404` | Ressource non trouvée | Annonce ou glanage inexistant      |
| `429` | Trop de requêtes      | Rate limiting activé               |
| `500` | Erreur serveur        | Erreur interne du serveur          |

### Format des erreurs

```json
{
  "message": "Description détaillée de l'erreur",
  "status": 400,
  "details": "Informations supplémentaires si disponibles"
}
```

## Rate Limiting

- **Endpoints publics** : 100 requêtes par minute par adresse IP
- **Endpoints authentifiés** : 1000 requêtes par heure par utilisateur
- **Recherches géographiques** : Limitées à 50 requêtes par minute

## Tests et Développement

### Tester l'API en local

```bash
# Démarrer le serveur de développement
pnpm dev

# Tester les endpoints publics
curl "http://localhost:3000/api/v1/crop-types"
curl "http://localhost:3000/api/v1/announcements?city=Namur"

# Tester avec géolocalisation
curl "http://localhost:3000/api/v1/announcements?lat=50.8503&lng=4.3517&radius=10"
```

### Tests avec authentification

Pour tester les endpoints authentifiés, connectez-vous d'abord via l'interface web, puis utilisez les cookies de session :

```bash
# Sauvegarder les cookies
curl -c cookies.txt http://localhost:3000/auth/signin

# Utiliser les cookies pour les requêtes authentifiées
curl -b cookies.txt http://localhost:3000/api/v1/profile
```

## Support et Documentation

- **Documentation technique** : [app/api/v1/README.md](../app/api/v1/README.md)
- **Tests API** : [app/api/v1/test-api-requests.md](../app/api/v1/test-api-requests.md)
- **Issues GitHub** : Système d'issues du repository principal
- **Contact** : Via la plateforme Field4u
