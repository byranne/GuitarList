-- Deferred email verification: users sign up with email + password and get in
-- right away ("Confirm email" is off), then can verify their inbox later with an
-- emailed code. Verification is tracked here because auth.users.email_confirmed_at
-- is set automatically at signup when confirmations are off.

alter table public.profiles add column email_verified_at timestamptz;

-- Owners may edit their profile, but not mark themselves verified. A table-level
-- UPDATE grant would override a column-level revoke, so re-grant column by column.
revoke update on public.profiles from anon, authenticated;
grant update (username, display_name, avatar_url) on public.profiles to authenticated;

-- Marks the caller verified, but only if this session came from verifying an
-- emailed code (GoTrue records that in the JWT's amr claim). A password session
-- can't call its way to verified.
create function public.mark_email_verified()
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  verified_at timestamptz;
begin
  if not exists (
    select 1
    from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) as m
    where m ->> 'method' = 'otp'
  ) then
    raise exception 'session was not created from an email code'
      using errcode = '42501';
  end if;

  update public.profiles
  set email_verified_at = coalesce(email_verified_at, now())
  where id = auth.uid()
  returning email_verified_at into verified_at;

  return verified_at;
end;
$$;

revoke execute on function public.mark_email_verified() from public, anon;
grant execute on function public.mark_email_verified() to authenticated;
