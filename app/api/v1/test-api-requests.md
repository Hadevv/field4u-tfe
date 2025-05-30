# Tests API v1 - Guide Complet

## Configuration des Tests

### Base URL

**Développement :**

```
http://localhost:3000/api/v1
```

**Production :**

```
https://field4u.vercel.app/api/v1
```

### Authentification

Pour les endpoints protégés, vous devez être connecté dans votre navigateur avec une session valide ou utiliser les cookies de session.

## Endpoints Publics (Aucune authentification requise)

### 1. Types de Cultures

**Récupérer tous les types de cultures :**

```bash
curl "http://localhost:3000/api/v1/crop-types"
```

**Avec pagination :**

```bash
curl "http://localhost:3000/api/v1/crop-types?page=1&limit=5"
```

**Filtrer par catégorie :**

```bash
curl "http://localhost:3000/api/v1/crop-types?category=FRUIT"
```

**Filtrer par saison :**

```bash
curl "http://localhost:3000/api/v1/crop-types?season=FALL"
```

**Combinaison de filtres :**

```bash
curl "http://localhost:3000/api/v1/crop-types?category=VEGETABLE&season=SUMMER&limit=10"
```

### 2. Annonces - Recherche Générale

**Toutes les annonces :**

```bash
curl "http://localhost:3000/api/v1/announcements"
```

**Avec pagination :**

```bash
curl "http://localhost:3000/api/v1/announcements?page=1&limit=5"
```

**Recherche par texte :**

```bash
curl "http://localhost:3000/api/v1/announcements?search=tomate"
curl "http://localhost:3000/api/v1/announcements?search=pomme"
curl "http://localhost:3000/api/v1/announcements?search=bio"
```

**Recherche par ville :**

```bash
curl "http://localhost:3000/api/v1/announcements?city=Bruxelles"
curl "http://localhost:3000/api/v1/announcements?city=Namur"
curl "http://localhost:3000/api/v1/announcements?city=Liège"
```

**Recherche par type de culture :**

```bash
# Remplacer CROP_TYPE_ID par un ID réel obtenu via /crop-types
curl "http://localhost:3000/api/v1/announcements?cropType=CROP_TYPE_ID"
```

**Recherche combinée :**

```bash
curl "http://localhost:3000/api/v1/announcements?search=pomme&city=Namur&limit=5"
```

### 3. Annonces - Recherche Géographique

**Recherche autour de Bruxelles (10km) :**

```bash
curl "http://localhost:3000/api/v1/announcements?lat=50.8503&lng=4.3517&radius=10"
```

**Recherche autour de Namur (25km) :**

```bash
curl "http://localhost:3000/api/v1/announcements?lat=50.4673&lng=4.8719&radius=25"
```

**Recherche autour de Liège (15km) :**

```bash
curl "http://localhost:3000/api/v1/announcements?lat=50.6292&lng=5.5797&radius=15"
```

**Recherche géographique avec filtres :**

```bash
curl "http://localhost:3000/api/v1/announcements?lat=50.8503&lng=4.3517&radius=20&search=bio&limit=10"
```

**Recherche géographique avec pagination :**

```bash
curl "http://localhost:3000/api/v1/announcements?lat=50.8503&lng=4.3517&radius=15&page=2&limit=5"
```

### 4. Détails d'une Annonce

```bash
# Remplacer {ANNOUNCEMENT_ID} par un ID réel obtenu depuis la liste des annonces
curl "http://localhost:3000/api/v1/announcements/{ANNOUNCEMENT_ID}"

# Exemple avec un ID partiel (format anonymisé)
curl "http://localhost:3000/api/v1/announcements/abc12345..."
```

### 5. Avis d'un Glanage

**Avis d'un glanage terminé :**

```bash
# Remplacer {GLEANING_ID} par un ID de glanage avec statut COMPLETED
curl "http://localhost:3000/api/v1/gleanings/{GLEANING_ID}/reviews"
```

**Avec pagination :**

```bash
curl "http://localhost:3000/api/v1/gleanings/{GLEANING_ID}/reviews?page=1&limit=5"
```

## Endpoints Authentifiés (Session requise)

### Prérequis pour l'authentification

**Option 1 : Connexion via navigateur (Recommandée)**

1. Ouvrez http://localhost:3000/auth/signin dans votre navigateur
2. Connectez-vous avec un compte valide
3. Les cookies de session seront automatiquement définis

**Option 2 : Utilisation de cookies avec curl**

```bash
# Sauvegarder les cookies lors de la connexion
curl -c cookies.txt -b cookies.txt "http://localhost:3000/auth/signin"

# Puis utiliser ces cookies pour les requêtes authentifiées
curl -b cookies.txt "http://localhost:3000/api/v1/profile"
```

### 6. Profil Utilisateur

**Récupérer le profil :**

```bash
curl -b cookies.txt "http://localhost:3000/api/v1/profile"
```

**Modifier le profil :**

```bash
curl -X PATCH -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"name":"Nouveau Nom","bio":"Ma nouvelle bio","city":"Bruxelles"}' \
  "http://localhost:3000/api/v1/profile"
```

### 7. Rejoindre/Quitter un Glanage

**Rejoindre un glanage :**

```bash
curl -X POST -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"gleaningId": "GLEANING_ID"}' \
  "http://localhost:3000/api/v1/gleanings/join"
```

**Quitter un glanage :**

```bash
curl -X DELETE -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"gleaningId": "GLEANING_ID"}' \
  "http://localhost:3000/api/v1/gleanings/join"
```

## Tests de Sécurité

### Vérifier la protection des endpoints authentifiés

Ces requêtes doivent retourner une erreur 401 (Non authentifié) :

```bash
# Test sans authentification - doit échouer
curl "http://localhost:3000/api/v1/profile"
curl -X POST -H "Content-Type: application/json" \
  -d '{"gleaningId":"test"}' \
  "http://localhost:3000/api/v1/gleanings/join"
```

### Tests de validation des paramètres

Ces requêtes doivent retourner une erreur 400 (Paramètres invalides) :

```bash
# Page invalide (minimum 1)
curl "http://localhost:3000/api/v1/announcements?page=0"

# Limite trop élevée (maximum 50)
curl "http://localhost:3000/api/v1/announcements?limit=100"

# Rayon trop grand (maximum 50km)
curl "http://localhost:3000/api/v1/announcements?lat=50.8503&lng=4.3517&radius=100"

# Coordonnées invalides
curl "http://localhost:3000/api/v1/announcements?lat=invalid&lng=invalid"

# Rayon sans coordonnées
curl "http://localhost:3000/api/v1/announcements?radius=10"
```

## Réponses Attendues

### Succès - Liste paginée

```json
{
  "data": [
    {
      "id": "abc12345...",
      "title": "Récolte de pommes bio",
      "description": "Description de l'annonce...",
      "quantityAvailable": 150,
      "startDate": "2024-01-15T09:00:00Z",
      "endDate": "2024-01-15T17:00:00Z",
      "field": {
        "city": "Namur",
        "postalCode": "5000",
        "locationRevealed": false
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### Succès - Recherche géographique

```json
{
  "data": [...],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "searchRadius": 10,
    "userLocation": { "lat": 50.8503, "lng": 4.3517 }
  }
}
```

### Succès - Action (rejoindre glanage)

```json
{
  "success": true,
  "message": "Vous avez rejoint le glanage avec succès",
  "participationId": "mno78901..."
}
```

### Erreur d'authentification (401)

```json
{
  "message": "Non authentifié",
  "status": 401
}
```

### Erreur de validation (400)

```json
{
  "message": "Paramètres invalides: radius doit être entre 1 et 50",
  "status": 400
}
```

### Erreur de ressource non trouvée (404)

```json
{
  "message": "Annonce non trouvée",
  "status": 404
}
```

## Tests Complets - Scénarios d'Usage

### Scénario 1 : Utilisateur cherche des glanages près de chez lui

```bash
# 1. Rechercher les types de cultures disponibles
curl "http://localhost:3000/api/v1/crop-types"

# 2. Rechercher des annonces dans un rayon de 20km
curl "http://localhost:3000/api/v1/announcements?lat=50.8503&lng=4.3517&radius=20"

# 3. Filtrer par type de culture (pommes)
curl "http://localhost:3000/api/v1/announcements?lat=50.8503&lng=4.3517&radius=20&search=pomme"

# 4. Voir les détails d'une annonce spécifique
curl "http://localhost:3000/api/v1/announcements/ANNOUNCEMENT_ID"
```

### Scénario 2 : Utilisateur authentifié rejoint un glanage

```bash
# 1. Se connecter (via navigateur ou cookies)
# 2. Voir son profil
curl -b cookies.txt "http://localhost:3000/api/v1/profile"

# 3. Rejoindre un glanage
curl -X POST -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"gleaningId": "GLEANING_ID"}' \
  "http://localhost:3000/api/v1/gleanings/join"

# 4. Consulter les avis du glanage (après participation)
curl "http://localhost:3000/api/v1/gleanings/GLEANING_ID/reviews"
```

## Notes de Sécurité et Fonctionnalités

### Géolocalisation Progressive

- **Plus de 24h avant le glanage** : Seules la ville et le code postal sont visibles
- **Moins de 24h avant** : Les coordonnées GPS exactes sont révélées
- **Testez avec des annonces ayant différentes dates de début**

### IDs Anonymisés

- Tous les IDs sont tronqués au format `abc12345...`
- Évite l'énumération des ressources
- Utilisez les IDs complets depuis l'interface d'admin pour les tests

### Rate Limiting

- Les requêtes sont limitées pour éviter les abus
- Si vous recevez une erreur 429, attendez avant de recommencer

## Outils Recommandés

### Pour les développeurs

- **Postman** : Interface graphique pour tester les APIs
- **curl** : Outil en ligne de commande (exemples ci-dessus)
- **HTTPie** : Alternative moderne à curl

### Pour les non-développeurs

- **Postman** avec interface graphique
- **Extension VSCode REST Client**
- **Interface web de développement** du navigateur (F12 > Network)

## Dépannage

### Problèmes courants

**Erreur CORS :**

- Assurez-vous d'utiliser les bonnes URLs
- Vérifiez que le serveur de développement est démarré

**Erreur d'authentification :**

- Vérifiez que vous êtes connecté via le navigateur
- Assurez-vous que les cookies sont bien transmis

**Erreur 404 :**

- Vérifiez que l'ID de la ressource existe
- Assurez-vous que l'endpoint est correct

**Pas de données :**

- Vérifiez que la base de données contient des données de test
- Lancez `pnpm seed` si nécessaire
