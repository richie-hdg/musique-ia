-- ============================================================================
--  MEMORART — Table des commandes
-- ============================================================================
--  À exécuter UNE FOIS dans le SQL Editor de ton projet Supabase existant
--  (réutilisation d'un projet actif, pas besoin d'un nouveau projet).
--
--  Le site (route /api/order) écrit ici avec la SERVICE ROLE KEY.
--  n8n lit la ligne correspondant au code reçu du webhook Chariow.
-- ============================================================================

create table if not exists public.memorart_orders (
  code        text primary key,               -- code court injecté chez Chariow
  names       text not null,                   -- prénoms & surnoms
  story       text not null,                   -- histoire d'amour
  message     text not null,                   -- message / promesse
  style       text not null,                   -- id technique du style (ex: afro-soul)
  style_title text not null,                   -- libellé lisible du style
  status      text not null default 'pending', -- pending | paid | generated | delivered
  created_at  timestamptz not null default now()
);

-- Recherche rapide par statut (suivi des commandes côté admin).
create index if not exists memorart_orders_status_idx
  on public.memorart_orders (status);

-- Sécurité : RLS activé. Aucune policy publique n'est créée, donc SEULE la
-- service_role key (utilisée par le site et par n8n) peut lire/écrire.
alter table public.memorart_orders enable row level security;
