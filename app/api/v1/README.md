# API Field4u v1

## aperçu

cette api publique permet aux clients externes (applications mobiles, services tiers, etc) d'interagir avec la plateforme field4u. elle suit les principes rest et utilise json pour les échanges de données

## structure

```
/api/v1/
  ├── auth/
  │   └── session/             # informations de session utilisateur
  ├── announcements/           # liste et filtre des annonces
  │   └── [id]/                # détails d'une annonce spécifique
  ├── crop-types/              # types de cultures
  ├── gleanings/               # liste et filtre des glanages
  │   └── participation/       # gestion des participations
  ├── notifications/           # gestion des notifications
  └── profile/                 # profil utilisateur
```

## authentification

l'api utilise l'authentification basée sur les cookies de session. pour les endpoints protégés, vous devez d'abord authentifier l'utilisateur via nextauth

```
GET /api/auth/signin           # redirection vers la page de login
GET /api/auth/signout          # déconnexion
GET /api/v1/auth/session       # vérifier l'état de la session
```

## réponses standard

réponse de liste paginée:

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

réponse d'erreur:

```json
{
  "message": "message d'erreur",
  "status": 400
}
```

## erreurs courantes

- `400` - paramètres manquants ou invalides
- `401` - non authentifié
- `403` - autorisations insuffisantes
- `404` - ressource non trouvée
- `500` - erreur serveur

## utilisation en développement local

1. cloner le dépôt
2. installer les dépendances: `pnpm install`
3. configurer les variables d'environnement
4. démarrer le serveur: `pnpm dev`
5. l'api sera disponible à `http://localhost:3000/api/v1/`

## documentation complète

pour une documentation complète et des exemples, consultez:

- [documentation api complète](../../docs/api-reference.md)
- [exemples d'utilisation](../../docs/api-examples.md)

## sécurité

tous les endpoints sont protégés par des validations de données avec zod et des vérifications d'authentification appropriées. les requêtes api sont limitées pour éviter les abus
