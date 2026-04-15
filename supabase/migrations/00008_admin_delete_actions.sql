DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;

CREATE POLICY "Admins can delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.delete_app_user(target_user_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  IF auth.uid()::text = target_user_id THEN
    RAISE EXCEPTION 'Admins cannot delete their own active account';
  END IF;

  DELETE FROM public.saved_plans
  WHERE user_id::text = target_user_id;

  DELETE FROM public.profiles
  WHERE id::text = target_user_id;

  DELETE FROM auth.users
  WHERE id::text = target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_app_user(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_app_user(TEXT) TO authenticated;
