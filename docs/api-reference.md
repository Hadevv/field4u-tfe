# Documentation API Field4u

## Introduction

L'API Field4u permet d'interagir avec la plateforme de glanage via des endpoints RESTful. Cette API peut être utilisée pour créer des applications mobiles ou des intégrations tierces

## Base URL

```
https://field4u.vercel.app/api/v1
```

## Authentification

L'API utilise l'authentification basée sur les cookies de session. Pour accéder aux endpoints protégés, l'utilisateur doit d'abord s'authentifier

### Authentification avec Next-Auth

Pour se connecter:

1. Rediriger l'utilisateur vers `/api/auth/signin`
2. L'utilisateur se connecte via email/mot de passe, magic link ou Google
3. Une fois connecté, les cookies de session sont automatiquement configurés

Les cookies de session sont automatiquement inclus dans les requêtes API suivantes

### Récupérer la session utilisateur

```
GET /auth/session
```

Réponse:

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "image": "https://example.com/image.jpg",
  "role": "GLEANER",
  "onboardingCompleted": true
}
```

## Endpoints

### Annonces

#### Récupérer les annonces

```
GET /announcements
```

Paramètres de requête:

- `page` (défaut: 1) - Page à récupérer
- `limit` (défaut: 10) - Nombre d'éléments par page
- `cropType` (optionnel) - Filtrer par type de culture
- `search` (optionnel) - Recherche textuelle
- `lat` (optionnel) - Latitude pour filtrage géographique
- `lng` (optionnel) - Longitude pour filtrage géographique
- `distance` (optionnel) - Distance en km pour filtrage géographique

#### Récupérer une annonce spécifique

```
GET /announcements/{id}
```

### Glanages

#### Récupérer les glanages

```
GET /gleanings
```

Paramètres de requête:

- `page` (défaut: 1) - Page à récupérer
- `limit` (défaut: 10) - Nombre d'éléments par page
- `status` (optionnel) - Filtrer par statut de glanage

#### Participer à un glanage

```
POST /gleanings/participation
```

Corps de la requête:

```json
{
  "gleaningId": "gleaning_id"
}
```

#### Se désinscrire d'un glanage

```
DELETE /gleanings/participation
```

Corps de la requête:

```json
{
  "gleaningId": "gleaning_id"
}
```

### Types de cultures

```
GET /crop-types
```

Paramètres de requête:

- `category` (optionnel) - Filtrer par catégorie
- `season` (optionnel) - Filtrer par saison

### Profil utilisateur

#### Récupérer le profil

```
GET /profile
```

#### Mettre à jour le profil

```
PATCH /profile
```

Corps de la requête (tous les champs sont optionnels):

```json
{
  "name": "Nouveau nom",
  "bio": "Ma biographie",
  "city": "Ma ville",
  "postalCode": "12345",
  "role": "FARMER",
  "language": "FRENCH",
  "acceptGeolocation": true,
  "image": "https://example.com/new-image.jpg"
}
```

### Notifications

#### Récupérer les notifications

```
GET /notifications
```

Paramètres de requête:

- `page` (défaut: 1) - Page à récupérer
- `limit` (défaut: 20) - Nombre d'éléments par page
- `unreadOnly` (défaut: false) - Filtrer pour afficher uniquement les notifications non lues

#### Marquer une notification comme lue

```
PATCH /notifications
```

Corps de la requête:

```json
{
  "id": "notification_id",
  "isRead": true
}
```

#### Marquer toutes les notifications comme lues

```
PUT /notifications
```

## Codes d'erreur

- `400` - Requête incorrecte
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## Modèles de données

### Annonce

```json
{
  "id": "string",
  "fieldId": "string",
  "title": "string",
  "slug": "string",
  "description": "string",
  "images": ["string"],
  "isPublished": true,
  "cropTypeId": "string",
  "quantityAvailable": 0,
  "ownerId": "string",
  "startDate": "2023-01-01T00:00:00Z",
  "endDate": "2023-01-02T00:00:00Z",
  "field": {},
  "cropType": {},
  "owner": {}
}
```

### Glanage

```json
{
  "id": "string",
  "announcementId": "string",
  "status": "NOT_STARTED",
  "announcement": {},
  "participations": [{}]
}
```
