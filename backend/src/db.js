import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function initDb() {
  await pool.query(`
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
    )
  `);

  // Feature 1: additional measurement columns
  await pool.query(`ALTER TABLE measurement_submissions ADD COLUMN IF NOT EXISTS neck_cm NUMERIC(6,2)`);
  await pool.query(`ALTER TABLE measurement_submissions ADD COLUMN IF NOT EXISTS front_length_cm NUMERIC(6,2)`);
  await pool.query(`ALTER TABLE measurement_submissions ADD COLUMN IF NOT EXISTS wrist_cm NUMERIC(6,2)`);

  // Feature 3: order status tracking columns
  await pool.query(`ALTER TABLE measurement_submissions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'submitted'`);
  await pool.query(`ALTER TABLE measurement_submissions ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ`);
  await pool.query(`ALTER TABLE measurement_submissions ADD COLUMN IF NOT EXISTS tailor_notes TEXT`);
}
