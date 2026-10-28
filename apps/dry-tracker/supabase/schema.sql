-- Buddy pairing for the dry tracker. Each person signs in anonymously (no email needed).
-- Only the two people in a pact can read it. Run this once in the Supabase SQL editor.

create table if not exists pacts (
  code text primary key,
  owner uuid not null default auth.uid(),
  owner_name text not null,
  partner uuid,
  partner_name text,
  created_at timestamptz not null default now()
);

create table if not exists pact_days (
  pact_code text not null references pacts(code) on delete cascade,
  user_id uuid not null default auth.uid(),
  date date not null,
  mark text not null check (mark in ('kept', 'missed')),
  updated_at timestamptz not null default now(),
  primary key (pact_code, user_id, date)
);

alter table pacts enable row level security;
alter table pact_days enable row level security;

create policy "members read pact" on pacts for select using (auth.uid() in (owner, partner));
create policy "owner creates pact" on pacts for insert with check (owner = auth.uid());

create policy "members read days" on pact_days for select
  using (exists (select 1 from pacts p where p.code = pact_code and auth.uid() in (p.owner, p.partner)));
create policy "members write own days" on pact_days for insert
  with check (user_id = auth.uid() and exists (select 1 from pacts p where p.code = pact_code and auth.uid() in (p.owner, p.partner)));
create policy "members update own days" on pact_days for update using (user_id = auth.uid());

-- Joining needs to find a pact the joiner cannot read yet, so it goes through this function.
create or replace function join_pact(p_code text, p_name text) returns text
language plpgsql security definer set search_path = public as $$
declare v_owner_name text;
begin
  update pacts set partner = auth.uid(), partner_name = p_name
   where code = upper(p_code) and partner is null and owner <> auth.uid()
   returning owner_name into v_owner_name;
  if v_owner_name is null then raise exception 'pact_not_available'; end if;
  return v_owner_name;
end $$;

grant execute on function join_pact(text, text) to authenticated;
