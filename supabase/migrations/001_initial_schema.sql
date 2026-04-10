-- ============================================================
-- CAMPP — Initial Schema Migration
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── profiles table (extends Supabase auth.users) ─────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text,
  email      text,
  role       text DEFAULT 'parent',   -- 'parent' | 'counselor' | 'admin'
  is_admin   boolean DEFAULT false,
  onboarded  boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── camps table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS camps (
  id                bigserial PRIMARY KEY,
  name              text NOT NULL,
  provider          text,
  category          text,
  location          text,
  city              text,
  region            text DEFAULT 'North County SD',
  age_min           integer,
  age_max           integer,
  price             numeric,
  price_type        text DEFAULT 'week',
  dates             text,
  sessions          text[],
  reg_deadline      date,
  status            text DEFAULT 'open',   -- 'open' | 'popular' | 'almost-full'
  spots_left        integer,
  rating            numeric(3,1),
  reviews_count     integer DEFAULT 0,
  description       text,
  tags              text[],
  icon              text,
  accent            text,
  accent_light      text,
  registration_url  text,
  suggestion_source text DEFAULT 'admin',  -- 'admin' | 'community'
  submitted_by      uuid REFERENCES profiles(id),
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE camps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved camps"
  ON camps FOR SELECT USING (status != 'pending');

CREATE POLICY "Admins can do everything with camps"
  ON camps FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Logged-in users can suggest camps"
  ON camps FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND suggestion_source = 'community');


-- ── camp_suggestions table (community suggestions queue) ─────
-- Separate from camps so Casey approves before going live
CREATE TABLE IF NOT EXISTS camp_suggestions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by uuid REFERENCES profiles(id),
  camp_name    text NOT NULL,
  organization text,
  category     text,
  city         text,
  url          text,
  age_min      integer,
  age_max      integer,
  cost         text,
  dates        text,
  notes        text,
  status       text DEFAULT 'pending',  -- 'pending' | 'approved' | 'declined'
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE camp_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit suggestions"
  ON camp_suggestions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can see their own suggestions"
  ON camp_suggestions FOR SELECT USING (submitted_by = auth.uid());

CREATE POLICY "Admins see all suggestions"
  ON camp_suggestions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));


-- ── kids table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kids (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id      uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name           text NOT NULL,
  age            integer,
  avatar_color   text,
  photo_url      text,
  interests      text[],
  environment    text,  -- 'indoor' | 'outdoor' | 'both'
  stimulation    text,  -- 'low' | 'moderate' | 'high'
  challenge      text,  -- 'easy' | 'moderate' | 'challenging'
  past_camp_ids  bigint[],
  is_example     boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE kids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents manage own kids"
  ON kids FOR ALL USING (parent_id = auth.uid());


-- ── saved_camps table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_camps (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  camp_id     bigint REFERENCES camps(id),
  kid_id      uuid REFERENCES kids(id),
  session     text,
  registered  boolean DEFAULT false,
  saved_at    timestamptz DEFAULT now(),
  UNIQUE(parent_id, camp_id)
);

ALTER TABLE saved_camps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents manage own saved camps"
  ON saved_camps FOR ALL USING (parent_id = auth.uid());


-- ── counselor_profiles table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS counselor_profiles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id       uuid REFERENCES profiles(id) ON DELETE CASCADE,
  first_name       text NOT NULL,
  last_name        text NOT NULL,
  age              integer CHECK (age BETWEEN 14 AND 20),
  grade            text,
  school           text,
  phone            text,
  city             text,
  zip              text,
  interests        text[],
  prior_experience text,
  why_counsel      text,
  months           text[],
  days             text[],
  hours            text,
  transport        boolean DEFAULT false,
  cover_note       text,
  resume_url       text,
  status           text DEFAULT 'active',
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE counselor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Counselors manage own profile"
  ON counselor_profiles FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Admins see all counselor profiles"
  ON counselor_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));


-- ── counselor_applications table ─────────────────────────────
CREATE TABLE IF NOT EXISTS counselor_applications (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_profile_id uuid REFERENCES counselor_profiles(id) ON DELETE CASCADE,
  camp_id              bigint REFERENCES camps(id) ON DELETE SET NULL,
  camp_name            text,
  application_type     text DEFAULT 'general',   -- 'general' | 'specific_camp'
  cover_note           text,
  status               text DEFAULT 'pending',   -- 'pending' | 'reviewed' | 'contacted' | 'hired' | 'declined'
  admin_notes          text,
  submitted_at         timestamptz DEFAULT now(),
  reviewed_at          timestamptz
);

ALTER TABLE counselor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Counselors manage own applications"
  ON counselor_applications FOR ALL
  USING (counselor_profile_id IN (
    SELECT id FROM counselor_profiles WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Admins see all applications"
  ON counselor_applications FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));


-- ── reviews table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id    bigint REFERENCES camps(id) ON DELETE CASCADE,
  parent_id  uuid REFERENCES profiles(id),
  name       text,
  location   text,
  rating     integer CHECK (rating BETWEEN 1 AND 5),
  body       text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Logged-in users can write reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE USING (parent_id = auth.uid());


-- ============================================================
-- Done! Tables created:
--   profiles, camps, camp_suggestions, kids,
--   saved_camps, counselor_profiles, counselor_applications, reviews
-- ============================================================
