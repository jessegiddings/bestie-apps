-- Run after schema.sql for existing installations. Transactional, private snapshot sync.
begin;
alter table public.pact_days drop constraint if exists pact_days_mark_check;
alter table public.pact_days add constraint pact_days_mark_check check (mark in ('kept', 'missed', 'paused'));
drop policy if exists "members update own days" on public.pact_days;
create policy "members update own days" on public.pact_days for update
  using (user_id = auth.uid() and exists (select 1 from public.pacts p where p.code = pact_code and auth.uid() in (p.owner, p.partner)))
  with check (user_id = auth.uid() and exists (select 1 from public.pacts p where p.code = pact_code and auth.uid() in (p.owner, p.partner)));

create or replace function public.sync_pact_days(p_code text, p_days jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  perform 1 from public.pacts where code = p_code and auth.uid() in (owner, partner) for update;
  if not found then raise exception 'pact_not_available'; end if;
  if jsonb_typeof(p_days) is distinct from 'array' then raise exception 'invalid_days'; end if;
  if jsonb_array_length(p_days) > 10000 then raise exception 'too_many_days'; end if;
  -- Invalid rows abort the transaction, preserving the previous snapshot.
  delete from public.pact_days where pact_code = p_code and user_id = auth.uid();
  insert into public.pact_days(pact_code, user_id, date, mark)
    select p_code, auth.uid(), (d->>'date')::date, d->>'mark' from jsonb_array_elements(p_days) d;
end $$;

create or replace function public.leave_pact(p_code text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  -- Idempotent: a buddy who already ended the pair has already removed its data.
  delete from public.pacts where code = p_code and auth.uid() in (owner, partner);
end $$;

revoke all on function public.join_pact(text, text) from public, anon;
revoke all on function public.sync_pact_days(text, jsonb) from public, anon;
revoke all on function public.leave_pact(text) from public, anon;
grant execute on function public.join_pact(text, text) to authenticated;
grant execute on function public.sync_pact_days(text, jsonb) to authenticated;
grant execute on function public.leave_pact(text) to authenticated;
commit;
