DO $$
DECLARE
  profile_id_type text;
BEGIN
  SELECT data_type
  INTO profile_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'id';

  IF profile_id_type IS NULL THEN
    RAISE EXCEPTION 'public.profiles.id does not exist. Create the profiles table first.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'saved_plans'
  ) THEN
    EXECUTE format(
      'CREATE TABLE public.saved_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id %s,
        plan_name TEXT NOT NULL,
        plan_data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )',
      CASE WHEN profile_id_type = 'uuid' THEN 'UUID' ELSE 'TEXT' END
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'saved_plans' AND column_name = 'user_id'
  ) THEN
    EXECUTE format(
      'ALTER TABLE public.saved_plans ADD COLUMN user_id %s',
      CASE WHEN profile_id_type = 'uuid' THEN 'UUID' ELSE 'TEXT' END
    );
  END IF;

  IF profile_id_type = 'uuid' THEN
    BEGIN
      EXECUTE 'ALTER TABLE public.saved_plans ALTER COLUMN user_id TYPE UUID USING user_id::uuid';
    EXCEPTION
      WHEN invalid_text_representation THEN
        RAISE EXCEPTION 'saved_plans.user_id contains non-UUID values, so it cannot be converted to UUID automatically.';
    END;
  ELSE
    EXECUTE 'ALTER TABLE public.saved_plans ALTER COLUMN user_id TYPE TEXT USING user_id::text';
  END IF;

  EXECUTE 'ALTER TABLE public.saved_plans ADD COLUMN IF NOT EXISTS plan_name TEXT';
  EXECUTE 'ALTER TABLE public.saved_plans ADD COLUMN IF NOT EXISTS plan_data JSONB';
  EXECUTE 'ALTER TABLE public.saved_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()';
  EXECUTE 'ALTER TABLE public.saved_plans ALTER COLUMN plan_name SET NOT NULL';
  EXECUTE 'ALTER TABLE public.saved_plans ALTER COLUMN plan_data SET NOT NULL';

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'saved_plans_user_id_fkey'
      AND conrelid = 'public.saved_plans'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE public.saved_plans ADD CONSTRAINT saved_plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE';
  END IF;
END
$$;

ALTER TABLE public.saved_plans ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'saved_plans'
      AND policyname = 'Users can view their own plans'
  ) THEN
    CREATE POLICY "Users can view their own plans" ON public.saved_plans
      FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'saved_plans'
      AND policyname = 'Users can insert their own plans'
  ) THEN
    CREATE POLICY "Users can insert their own plans" ON public.saved_plans
      FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id::text);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'saved_plans'
      AND policyname = 'Users can update their own plans'
  ) THEN
    CREATE POLICY "Users can update their own plans" ON public.saved_plans
      FOR UPDATE TO authenticated USING (auth.uid()::text = user_id::text);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'saved_plans'
      AND policyname = 'Users can delete their own plans'
  ) THEN
    CREATE POLICY "Users can delete their own plans" ON public.saved_plans
      FOR DELETE TO authenticated USING (auth.uid()::text = user_id::text);
  END IF;
END
$$;
