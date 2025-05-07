# tests e2e - field4u

ce dossier contient tous les tests end-to-end (e2e)

## structure des tests

les tests sont organisés selon les roles utilisateurs :

- **setup** : création des états d'authentification pour les trois rôles
- **public** : tests sans authentification (inscription, onboarding, etc.)
- **gleaner** : tests avec un glaneur authentifié
- **farmer** : tests avec un agriculteur authentifié
- **admin** : tests avec un administrateur authentifié

## fichiers principaux

- `auth.setup.ts` : génère les états d'authentification pour chaque type d'utilisateur
- `global-setup.ts` : prépare l'environnement de test (dossiers d'authentification)
- `auth.e2e.ts` : tests d'authentification (connexion, inscription)
- `onboarding.e2e.ts` : tests du processus d'onboarding
- `announcement.e2e.ts` : tests gestion des annonces
- `gleaning.e2e.ts` : tests gestion des glanages

## convention de nommage

pour faciliter l'identification des comptes créés par les tests :

- tous les emails créés commencent par `e2e-test-`
- chaque test crée un email unique avec timestamp

## exécuter les tests

```bash
pnpm exec playwright test

pnpm exec playwright test e2e/auth.setup.ts --project=setup

pnpm exec playwright test --project=public

pnpm exec playwright test --project=farmer
pnpm exec playwright test --project=admin
```
