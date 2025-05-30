# Test des Webhooks Stripe - Sécurité des Paiements

## Comment tester la sécurité

### 1. Test avec Stripe CLI (recommandé)

```bash
# installer stripe cli
# https://stripe.com/docs/stripe-cli

# se connecter à votre compte
stripe login

# écouter les webhooks en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# déclencher des événements de test
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

### 2. Test via l'interface Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/test/webhooks
2. Créer un endpoint : `https://votre-domain.com/api/webhooks/stripe`
3. Sélectionner les événements :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`

### 3. Test de simulation d'attaque

```bash
# tenter d'accéder directement aux pages de redirection
curl "http://localhost:3000/payment/success?payment_intent=pi_fake123"
curl "http://localhost:3000/payment/cancel?payment_intent=pi_fake123"

```

## Variables d'environnement requises

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Événements Stripe gérés

### Paiements de participation

- `payment_intent.succeeded` → marque le paiement comme réussi + notification
- `payment_intent.payment_failed` → marque le paiement comme échoué (sans notification, visible dans Stripe)

### Abonnements premium

- `checkout.session.completed` → upgrade vers premium
- `invoice.paid` → renouvellement réussi
- `invoice.payment_failed` → downgrade vers free
- `customer.subscription.deleted` → annulation abonnement
- `customer.subscription.updated` → changement de plan

## Tests d'intégration

```typescript
// exemple de test à ajouter
describe("Webhook Security", () => {
  test("payment pages ne modifient pas les statuts", async () => {
    // accéder à /payment/success avec fake payment_intent
    // vérifier qu'aucune donnée n'est modifiée en DB
  });

  test("seuls les webhooks signés modifient les paiements", async () => {
    // envoyer webhook sans signature valide
    // vérifier le rejet avec status 400
  });
});
```

## Tests rapides

```bash
# tester que les pages ne font rien de dangereux
curl "http://localhost:3000/payment/success?payment_intent=pi_fake"
curl "http://localhost:3000/payment/cancel?payment_intent=pi_fake"

# tester les webhooks (avec Stripe CLI)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```
