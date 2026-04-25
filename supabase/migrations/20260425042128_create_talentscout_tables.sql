/*
  # Create TalentScout Agent Tables

  1. New Tables
    - `job_descriptions`
      - `id` (uuid, primary key)
      - `raw_text` (text, the full JD text)
      - `role` (text, extracted role)
      - `skills` (text array, extracted skills)
      - `experience` (text, experience requirement)
      - `experience_years` (integer, numeric years)
      - `created_at` (timestamp)
    - `candidates`
      - `id` (uuid, primary key)
      - `jd_id` (uuid, foreign key to job_descriptions)
      - `name` (text)
      - `skills` (text array)
      - `experience` (integer, years)
      - `location` (text)
      - `availability` (text)
      - `created_at` (timestamp)
    - `match_results`
      - `id` (uuid, primary key)
      - `jd_id` (uuid, foreign key to job_descriptions)
      - `candidate_id` (uuid, foreign key to candidates)
      - `match_score` (integer)
      - `skill_score` (integer)
      - `experience_score` (integer)
      - `matched_skills` (text array)
      - `missing_skills` (text array)
      - `explanation` (text)
      - `interest_score` (integer)
      - `interest_level` (text)
      - `final_score` (integer)
      - `recommended_action` (text)
      - `rank` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add permissive policies for anon and authenticated access (this is a demo app)
*/

CREATE TABLE IF NOT EXISTS job_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_text text NOT NULL,
  role text NOT NULL DEFAULT '',
  skills text[] DEFAULT '{}',
  experience text NOT NULL DEFAULT '',
  experience_years integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access on job_descriptions"
  ON job_descriptions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert on job_descriptions"
  ON job_descriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jd_id uuid REFERENCES job_descriptions(id) ON DELETE CASCADE,
  name text NOT NULL,
  skills text[] DEFAULT '{}',
  experience integer DEFAULT 0,
  location text DEFAULT '',
  availability text DEFAULT 'Available',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access on candidates"
  ON candidates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert on candidates"
  ON candidates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jd_id uuid REFERENCES job_descriptions(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  match_score integer DEFAULT 0,
  skill_score integer DEFAULT 0,
  experience_score integer DEFAULT 0,
  matched_skills text[] DEFAULT '{}',
  missing_skills text[] DEFAULT '{}',
  explanation text DEFAULT '',
  interest_score integer DEFAULT 0,
  interest_level text DEFAULT 'maybe',
  final_score integer DEFAULT 0,
  recommended_action text DEFAULT 'Keep warm',
  rank integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access on match_results"
  ON match_results FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert on match_results"
  ON match_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
