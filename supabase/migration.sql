-- ============================================================================
--  DECLALUVSONG — Table des commandes
-- ============================================================================
--  Projet à part entière. TOUTES les tables/buckets de ce projet utilisent le
--  préfixe `declaluvsong` (aucun rapport avec d'autres projets de la base).
--
--  À exécuter UNE FOIS dans le SQL Editor de ton projet Supabase.
--  Le site (route /api/order) écrit ici avec la SERVICE ROLE KEY.
--  n8n lit la ligne correspondant au code reçu du webhook Chariow.
-- ============================================================================

create table if not exists public.declaluvsong_orders (
  code             text primary key,               -- code court injecté chez Chariow
  orderer_name     text not null,                   -- prénom du commanditaire
  orderer_nickname text,                            -- surnom du commanditaire (optionnel)
  partner_name     text not null,                   -- prénom de la personne dédiée
  partner_nickname text,                            -- surnom de la personne dédiée (optionnel)
  message          text not null,                   -- message à transmettre + histoire d'amour
  style            text not null,                   -- id technique du style (ex: afro-soul)
  style_title      text not null,                   -- libellé lisible du style
  status           text not null default 'pending', -- pending | paid | generated | delivered
  created_at       timestamptz not null default now()
);

-- Recherche rapide par statut (suivi des commandes côté admin).
create index if not exists declaluvsong_orders_status_idx
  on public.declaluvsong_orders (status);

-- Sécurité : RLS activé. Aucune policy publique n'est créée, donc SEULE la
-- service_role key (utilisée par le site et par n8n) peut lire/écrire.
alter table public.declaluvsong_orders enable row level security;
