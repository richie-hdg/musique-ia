# 🎵 Memorart — Chansons personnalisées par IA

Landing page + formulaire de commande pour la génération de chansons d'amour/surprise personnalisées (marché ouest-africain). Le site capture l'histoire du client, l'**enregistre dans Supabase**, puis redirige vers le paiement **Chariow** (Mobile Money) avec un simple **code court** en champ personnalisé. La génération (Suno via Apiframe) et la livraison (WhatsApp) sont gérées côté **n8n**.

Univers visuel : **Midnight Romance & Gold** — nocturne, intimiste, touches dorées.

---

## 🚀 Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS 3**
- Polices Google : *Playfair Display* (titres) + *Plus Jakarta Sans* (texte)
- Déploiement : **Vercel**

## 📁 Structure

```
app/
  layout.tsx          Métadonnées, polices, <html>
  page.tsx            Assemble la page unique (Hero → Steps → Form → footer)
  globals.css         Thème, halo romantique, style des champs
  api/order/route.ts  Enregistre la commande dans Supabase, renvoie le code court
components/
  Hero.tsx            Section d'accroche émotionnelle
  Steps.tsx           Les 3 étapes du processus
  OrderForm.tsx       Formulaire → POST /api/order → redirection Chariow (client)
lib/
  config.ts           ⚙️ SEUL FICHIER À ÉDITER : URL Chariow, styles musicaux
  serialize.ts        Génération du code court + construction de l'URL Chariow
supabase/
  migration.sql       Table memorart_orders (à exécuter une fois dans Supabase)
.env.example          Variables d'environnement du site
```

## ⚙️ Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigne l'URL Chariow
npm run dev                  # http://localhost:3000
npm run build && npm start   # build de production
```

## 🔌 Brancher Chariow (obligatoire avant mise en ligne)

Définis ces variables dans Vercel (et dans `.env.local` en dev) :

| Variable | Rôle |
|---|---|
| `SUPABASE_URL` | URL de ton projet Supabase (réutilise un projet existant) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (côté serveur uniquement, **jamais** `NEXT_PUBLIC`) |
| `NEXT_PUBLIC_CHARIOW_CHECKOUT_URL` | URL de checkout de ton produit Chariow |
| `NEXT_PUBLIC_CHARIOW_CUSTOM_FIELD` | Nom du paramètre de champ perso (souvent `custom_field` ou `cf`) |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP` | (optionnel) numéro WhatsApp support, format international sans `+` |

**Avant tout :** exécute une fois `supabase/migration.sql` dans le SQL Editor de ton projet Supabase (crée la table `memorart_orders`).

**Fonctionnement :** au clic sur « Valider et passer au paiement », le site enregistre la commande dans Supabase via `POST /api/order` et récupère un **code court de 10 caractères** (ex. `Kf9mQ2xLpT`). Seul ce code est injecté dans le champ perso Chariow — propre et discret pour le client. Exemple d'URL générée :

```
https://ta-boutique.chariow.store/checkout/chanson?custom_field=Kf9mQ2xLpT
```

> 💡 Dans Chariow, mets ce champ perso en lecture seule / pré-rempli avec la mention « Ne pas modifier ». Le client n'a rien à y toucher.

## 🤖 Côté n8n — retrouver la commande (à faire dans ton workflow)

Le webhook Chariow te renverra le **code court**. Interroge Supabase avec ce code (nœud *HTTP Request* ou *Supabase* dans n8n) :

```
GET {{SUPABASE_URL}}/rest/v1/memorart_orders?code=eq.{{ $json.custom_field }}&select=*
Headers:
  apikey: {{SUPABASE_SERVICE_ROLE_KEY}}
  Authorization: Bearer {{SUPABASE_SERVICE_ROLE_KEY}}
```

La réponse contient `{ code, names, story, message, style, style_title, status, created_at }`.

Le champ `style` (id technique : `afro-soul`, `kizomba`, `acoustique`, `rumba`, `afrobeats`, `gospel`) sert à choisir le prompt de style Suno ; `style_title` est le libellé lisible. Pense à passer `status` à `paid` puis `delivered` au fil du workflow.

---

## 🌍 Écosystème complet & décisions techniques

> Récapitulatif pour reprise facile dans une future conversation/projet.

### Flux de bout en bout
1. **Landing (Vercel)** → client remplit le formulaire → commande stockée dans Supabase, code court généré.
2. **Redirection** → seul le code court est injecté dans l'URL Chariow (champ perso léger).
3. **Paiement (Chariow)** → Mobile Money (Orange, Moov, MTN, Wave).
4. **Webhook → n8n** → lecture de la commande dans Supabase via le code.
5. **Génération (Apiframe / Suno)** → prompt + paroles → MP3.
6. **Livraison (WhatsApp via Green API)** → le MP3 est envoyé en **pièce jointe native** (sauvegardé à vie dans le téléphone), pas un lien qui expire.
7. **Secours** → copie du MP3 dans Supabase Storage.

### Choix validés
- **Suno via Apiframe** (pas Google Lyria, pas PiAPI) : Suno structure des chansons commerciales complètes en français/argots ; Apiframe = le plus stable/documenté, paiement par recharge de crédits.
- **WhatsApp = Green API** (passerelle non-officielle) : pas de vérification Meta Business, envoi de MP3 natif. Migration possible vers l'API Meta officielle plus tard si volume élevé.
- **Supabase : réutiliser un projet existant.** Free tier = 2 projets actifs. Pas besoin d'un 3e projet : la table **`memorart_orders`** (données de commande, clé = code court) + un **bucket `memorart-songs`** (MP3 de secours) dans un projet déjà actif suffisent. Isolation propre, 0 coût.

### Variables d'environnement de l'écosystème (hors site — vivent dans n8n / services)
Présentes dans l'environnement : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CHARIOW_N8N_API`, `MCP_CHARIOW_API`, `N8N_API_KEY`, `N8N_BASE_URL`, `GREEN_API_TOKEN`, `BREVO_API_KEY` (email), `FACEBOOK_CAPI_ACCESS_TOKEN` (tracking pub), `CHATWOOT_*` (support), `TELEGRAM_*` (notifs admin, dont un bot Memorart), `UPTIMEROBOT_API_KEY`, `VERCEL_API_TOKEN`.

> ✅ **`APIFRAME_API_KEY`** ajoutée aux variables d'environnement (credentials n8n) pour appeler Suno via Apiframe. Le site n'en a pas besoin. À vérifier via un appel test dans le workflow n8n.

### Pistes d'amélioration suggérées
- **Tracking conversion** : poser le Pixel Facebook côté site + envoyer l'event d'achat via `FACEBOOK_CAPI_ACCESS_TOKEN` depuis n8n (déduplication event_id) pour optimiser tes pubs.
- **Email de confirmation** via Brevo dès réception du paiement (rassure le client pendant les 24h d'attente).
- **Notif Telegram admin** à chaque commande (bot Memorart déjà dispo) pour suivi en temps réel.
- **Validation du numéro WhatsApp** au checkout Chariow (indispensable pour la livraison).
