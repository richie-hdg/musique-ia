# 🎵 Memorart — Chansons personnalisées par IA

Landing page + formulaire de commande pour la génération de chansons d'amour/surprise personnalisées (marché ouest-africain). Le site capture l'histoire du client puis le redirige vers le paiement **Chariow** (Mobile Money). La génération (Suno via Apiframe) et la livraison (WhatsApp) sont gérées côté **n8n**.

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
  layout.tsx        Métadonnées, polices, <html>
  page.tsx          Assemble la page unique (Hero → Steps → Form → footer)
  globals.css       Thème, halo romantique, style des champs
components/
  Hero.tsx          Section d'accroche émotionnelle
  Steps.tsx         Les 3 étapes du processus
  OrderForm.tsx     Formulaire interactif + redirection Chariow (client)
lib/
  config.ts         ⚙️ SEUL FICHIER À ÉDITER : URL Chariow, styles musicaux
  serialize.ts      Sérialisation Base64-URL des données → URL de checkout
.env.example        Variables d'environnement du site
```

## ⚙️ Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigne l'URL Chariow
npm run dev                  # http://localhost:3000
npm run build && npm start   # build de production
```

## 🔌 Brancher Chariow (obligatoire avant mise en ligne)

Édite `lib/config.ts` **ou** définis ces variables dans Vercel :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_CHARIOW_CHECKOUT_URL` | URL de checkout de ton produit Chariow |
| `NEXT_PUBLIC_CHARIOW_CUSTOM_FIELD` | Nom du paramètre de champ perso (souvent `custom_field` ou `cf`) |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP` | (optionnel) numéro WhatsApp support, format international sans `+` |

**Fonctionnement :** au clic sur « Valider et passer au paiement », les 4 réponses sont sérialisées en JSON puis encodées en **Base64-URL** (sûr pour l'URL, accents préservés) et injectées dans le paramètre configuré. Exemple d'URL générée :

```
https://ta-boutique.chariow.store/checkout/chanson?custom_field=eyJuYW1lcyI6...
```

## 🤖 Côté n8n — décoder les données (à faire dans ton workflow)

Le webhook Chariow te renverra la valeur du champ perso. Décode-la ainsi (nœud *Code* JS n8n) :

```js
function fromBase64Url(input) {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(b64, 'base64').toString('utf-8');
}
const data = JSON.parse(fromBase64Url($json.custom_field));
// → { names, story, message, style, styleTitle, createdAt, version }
return [{ json: data }];
```

Le champ `style` (id technique : `afro-soul`, `kizomba`, `acoustique`, `rumba`, `afrobeats`, `gospel`) sert à choisir le prompt de style Suno ; `styleTitle` est le libellé lisible.

---

## 🌍 Écosystème complet & décisions techniques

> Récapitulatif pour reprise facile dans une future conversation/projet.

### Flux de bout en bout
1. **Landing (Vercel)** → client rempli le formulaire.
2. **Redirection** → données Base64-URL injectées dans l'URL Chariow.
3. **Paiement (Chariow)** → Mobile Money (Orange, Moov, MTN, Wave).
4. **Webhook → n8n** → décodage des données.
5. **Génération (Apiframe / Suno)** → prompt + paroles → MP3.
6. **Livraison (WhatsApp via Green API)** → le MP3 est envoyé en **pièce jointe native** (sauvegardé à vie dans le téléphone), pas un lien qui expire.
7. **Secours** → copie du MP3 dans Supabase Storage.

### Choix validés
- **Suno via Apiframe** (pas Google Lyria, pas PiAPI) : Suno structure des chansons commerciales complètes en français/argots ; Apiframe = le plus stable/documenté, paiement par recharge de crédits.
- **WhatsApp = Green API** (passerelle non-officielle) : pas de vérification Meta Business, envoi de MP3 natif. Migration possible vers l'API Meta officielle plus tard si volume élevé.
- **Supabase : réutiliser un projet existant.** Free tier = 2 projets actifs. Pas besoin d'un 3e projet : un simple **bucket `memorart-songs`** (+ table optionnelle `memorart_orders`) dans un projet déjà actif suffit. Isolation propre, 0 coût.

### Variables d'environnement de l'écosystème (hors site — vivent dans n8n / services)
Présentes dans l'environnement : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CHARIOW_N8N_API`, `MCP_CHARIOW_API`, `N8N_API_KEY`, `N8N_BASE_URL`, `GREEN_API_TOKEN`, `BREVO_API_KEY` (email), `FACEBOOK_CAPI_ACCESS_TOKEN` (tracking pub), `CHATWOOT_*` (support), `TELEGRAM_*` (notifs admin, dont un bot Memorart), `UPTIMEROBOT_API_KEY`, `VERCEL_API_TOKEN`.

> ⚠️ **À ajouter avant la génération : `APIFRAME_API_KEY`** — absente de l'environnement actuel. Elle est nécessaire dans les credentials n8n pour appeler Suno via Apiframe. Le site n'en a pas besoin.

### Pistes d'amélioration suggérées
- **Tracking conversion** : poser le Pixel Facebook côté site + envoyer l'event d'achat via `FACEBOOK_CAPI_ACCESS_TOKEN` depuis n8n (déduplication event_id) pour optimiser tes pubs.
- **Email de confirmation** via Brevo dès réception du paiement (rassure le client pendant les 24h d'attente).
- **Notif Telegram admin** à chaque commande (bot Memorart déjà dispo) pour suivi en temps réel.
- **Validation du numéro WhatsApp** au checkout Chariow (indispensable pour la livraison).
