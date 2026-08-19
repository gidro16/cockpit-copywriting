-- ═══════════════════════════════════════════════════════════════════════
-- Migration multi-utilisateurs — Cockpit Copywriting
-- IMPORTANT : à exécuter en 2 étapes, DANS L'ORDRE (voir instructions
-- de Claude dans le chat). Ne saute pas d'étape, sinon tu risques de
-- perdre l'accès à tes projets actuels.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 1 — à coller et exécuter MAINTENANT (avant de te créer un compte)
-- ───────────────────────────────────────────────────────────────────────

-- Ajoute la colonne user_id, encore optionnelle à ce stade
alter table kv_store add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Table des emails autorisés à créer un compte
create table if not exists allowed_emails (
  email text primary key,
  created_at timestamptz default now()
);

-- Pré-enregistre ton propre email pour pouvoir te connecter
insert into allowed_emails (email) values ('christian.legrand.1609@gmail.com')
  on conflict (email) do nothing;

alter table allowed_emails enable row level security;

create policy "admin manage allowlist" on allowed_emails
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'christian.legrand.1609@gmail.com')
  with check (auth.jwt() ->> 'email' = 'christian.legrand.1609@gmail.com');

create policy "authenticated read allowlist" on allowed_emails
  for select to authenticated using (true);

-- Bloque la création de compte si l'email n'est pas dans allowed_emails
create or replace function check_allowed_email()
returns trigger as $$
begin
  if not exists (select 1 from allowed_emails where email = new.email) then
    raise exception 'not authorized';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists enforce_allowlist on auth.users;
create trigger enforce_allowlist
  before insert on auth.users
  for each row execute function check_allowed_email();


-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 2 — à coller et exécuter SEULEMENT APRÈS t'être créé un compte
-- avec ton email dans l'app (christian.legrand.1609@gmail.com), et
-- t'être connecté au moins une fois.
-- ───────────────────────────────────────────────────────────────────────

-- Rattache toutes tes données existantes (sans user_id) à ton compte
update kv_store set user_id = (
  select id from auth.users where email = 'christian.legrand.1609@gmail.com'
) where user_id is null;

-- Verrouille : chaque ligne doit maintenant appartenir à quelqu'un
alter table kv_store alter column user_id set not null;

-- Remplace la clé unique "key" par la paire (user_id, key)
alter table kv_store drop constraint if exists kv_store_pkey;
alter table kv_store drop constraint if exists kv_store_key_key;
alter table kv_store add primary key (user_id, key);

-- Retire l'ancienne règle "tout le monde peut tout faire"
drop policy if exists "allow anon" on kv_store;

-- Active la sécurité ligne par ligne
alter table kv_store enable row level security;

-- Chacun ne peut lire/écrire/supprimer que SES propres lignes
create policy "select own rows" on kv_store
  for select to authenticated using (user_id = auth.uid());
create policy "insert own rows" on kv_store
  for insert to authenticated with check (user_id = auth.uid());
create policy "update own rows" on kv_store
  for update to authenticated using (user_id = auth.uid());
create policy "delete own rows" on kv_store
  for delete to authenticated using (user_id = auth.uid());
