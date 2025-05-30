# Tests E2E - Field4u

## Configuration

### Utilisateurs de test

Assurez-vous d'avoir ces utilisateurs dans votre DB avec `onboardingCompleted: true` :

- `gleaner@field4u.be` (mot de passe: `Password123!`) - Role: GLEANER
- `farmer@field4u.be` (mot de passe: `Password123!`) - Role: FARMER
- `admin@field4u.be` (mot de passe: `Password123!`) - Role: ADMIN

### Prérequis

```bash
# Créer et seed la base de données
pnpm run seed
```

## Utilisation

```bash
# Tous les tests
pnpm test:e2e

# Tests spécifiques
pnpm test:e2e:auth
pnpm test:e2e:onboarding
pnpm test:e2e:gleaning
pnpm test:e2e:announcement
```

## Optimisations pour DB serverless

## Debug

```bash
# Mode visual
pnpm test:e2e --headed

# Mode debug
pnpm test:e2e --debug

# Tests spécifiques
pnpm test:e2e:auth
```

## Problèmes courants

### "Timed out waiting for URL"

- Cause : DB serverless lente à s'activer
- Solution : Les timeouts sont déjà optimisés, les retries automatiques se chargent du problème
