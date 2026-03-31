-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create user type enum
CREATE TYPE public.user_type AS ENUM ('tourist', 'local');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  user_type public.user_type DEFAULT 'tourist',
  role public.user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create places table
CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  timings TEXT,
  entry_fee TEXT,
  best_time TEXT,
  rating NUMERIC(2,1) DEFAULT 4.0,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create food_items table
CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price TEXT,
  rating NUMERIC(2,1) DEFAULT 4.0,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shopping table
CREATE TABLE public.shopping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT,
  timings TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create entertainment table
CREATE TABLE public.entertainment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT,
  timings TEXT,
  price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date DATE NOT NULL,
  location TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.user_type NOT NULL,
  duration TEXT NOT NULL,
  budget TEXT NOT NULL,
  places JSONB NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_plans table
CREATE TABLE public.saved_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entertainment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_plans ENABLE ROW LEVEL SECURITY;

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Public view for profiles
CREATE VIEW public.public_profiles AS
  SELECT id, role FROM public.profiles;

-- Content tables policies (public read, admin write)
CREATE POLICY "Anyone can view places" ON public.places
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Admins can manage places" ON public.places
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view food items" ON public.food_items
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Admins can manage food items" ON public.food_items
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view shopping" ON public.shopping
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Admins can manage shopping" ON public.shopping
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view entertainment" ON public.entertainment
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Admins can manage entertainment" ON public.entertainment
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view packages" ON public.packages
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Admins can manage packages" ON public.packages
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Saved plans policies (users can manage their own)
CREATE POLICY "Users can view their own plans" ON public.saved_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans" ON public.saved_plans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans" ON public.saved_plans
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans" ON public.saved_plans
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create trigger function to sync users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();