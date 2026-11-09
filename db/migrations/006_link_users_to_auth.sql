BEGIN;

-- The id now comes from auth.users, not from a random default.
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;

-- CASCADE: deleting an account removes its user. If the user still has
-- tickets, the RESTRICT on tickets.created_by blocks it, which is what we want.
ALTER TABLE users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

CREATE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_name text;
BEGIN
  v_name := left(
    coalesce(nullif(trim(NEW.raw_user_meta_data ->> 'display_name'), ''), split_part(NEW.email, '@', 1)),
    30
  );
  IF char_length(v_name) < 2 THEN
    v_name := 'User';
  END IF;

  INSERT INTO public.users (id, display_name) VALUES (NEW.id, v_name);
  RETURN NEW;
END;
$$;

-- This function is for the trigger only, so nobody can call it through the API.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;