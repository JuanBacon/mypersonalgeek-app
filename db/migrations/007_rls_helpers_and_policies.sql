BEGIN;

CREATE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = (SELECT auth.uid()) AND user_role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- users: you read your own row; admins read every row.
-- No INSERT, UPDATE or DELETE policy: nobody can change users through the API.
CREATE POLICY users_select ON public.users
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()) OR public.is_admin());

-- categories: logged-in users see active ones; admins see all and manage them.
CREATE POLICY categories_select ON public.categories
  FOR SELECT TO authenticated
  USING (is_active OR public.is_admin());

CREATE POLICY categories_admin_write ON public.categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

COMMIT;