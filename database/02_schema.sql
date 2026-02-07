\c buryat_tailoring;

CREATE TABLE IF NOT EXISTS measurement_submissions (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('cm', 'in')),
  chest_cm NUMERIC(6,2) NOT NULL,
  waist_cm NUMERIC(6,2) NOT NULL,
  hips_cm NUMERIC(6,2) NOT NULL,
  shoulder_cm NUMERIC(6,2) NOT NULL,
  sleeve_cm NUMERIC(6,2) NOT NULL,
  height_cm NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
