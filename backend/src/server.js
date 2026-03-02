import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { initDb, pool } from "./db.js";
import { measurementSchema, orderStatusSchema } from "./validation.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5500";

app.use(helmet());
app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "buryat-tailoring-backend" });
});

app.get("/api/measurements/definitions", (_req, res) => {
  res.json({
    version: 2,
    fields: ["chest", "waist", "hips", "shoulder", "sleeve", "neck", "frontLength", "wrist", "height"],
    baseUnit: "cm"
  });
});

app.post("/api/measurements/submit", async (req, res) => {
  const parsed = measurementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      message: "Invalid payload",
      issues: parsed.error.issues
    });
  }

  const data = parsed.data;
  const q = `
    INSERT INTO measurement_submissions (
      customer_name,
      customer_email,
      unit,
      chest_cm,
      waist_cm,
      hips_cm,
      shoulder_cm,
      sleeve_cm,
      height_cm,
      neck_cm,
      front_length_cm,
      wrist_cm
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING id, created_at;
  `;

  const args = [
    data.customerName,
    data.customerEmail,
    data.unit,
    data.valuesCm.chest,
    data.valuesCm.waist,
    data.valuesCm.hips,
    data.valuesCm.shoulder,
    data.valuesCm.sleeve,
    data.valuesCm.height,
    data.valuesCm.neck ?? null,
    data.valuesCm.frontLength ?? null,
    data.valuesCm.wrist ?? null
  ];

  try {
    const result = await pool.query(q, args);
    return res.status(201).json({
      ok: true,
      submissionId: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Could not save submission"
    });
  }
});

// --- Order tracking routes ---

app.get("/api/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ ok: false, message: "Invalid order ID" });
  }

  try {
    const result = await pool.query(
      `SELECT id, customer_name, customer_email, unit,
              chest_cm, waist_cm, hips_cm, shoulder_cm, sleeve_cm, height_cm,
              neck_cm, front_length_cm, wrist_cm,
              status, status_updated_at, tailor_notes, created_at
       FROM measurement_submissions WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Order not found" });
    }

    return res.json({ ok: true, order: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Could not fetch order" });
  }
});

app.get("/api/orders", async (req, res) => {
  const email = (req.query.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ ok: false, message: "email query parameter required" });
  }

  try {
    const result = await pool.query(
      `SELECT id, customer_name, unit, status, status_updated_at, tailor_notes, created_at
       FROM measurement_submissions
       WHERE LOWER(customer_email) = $1
       ORDER BY created_at DESC`,
      [email]
    );

    return res.json({ ok: true, orders: result.rows });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Could not fetch orders" });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ ok: false, message: "Invalid order ID" });
  }

  const parsed = orderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      message: "Invalid status update",
      issues: parsed.error.issues
    });
  }

  const { status, notes } = parsed.data;

  try {
    const result = await pool.query(
      `UPDATE measurement_submissions
       SET status = $1, status_updated_at = NOW(), tailor_notes = COALESCE($2, tailor_notes)
       WHERE id = $3
       RETURNING id, status, status_updated_at, tailor_notes`,
      [status, notes ?? null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Order not found" });
    }

    return res.json({ ok: true, order: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Could not update status" });
  }
});

app.get("/api/admin/orders", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, customer_name, customer_email, unit,
              chest_cm, waist_cm, hips_cm, shoulder_cm, sleeve_cm, height_cm,
              neck_cm, front_length_cm, wrist_cm,
              status, status_updated_at, tailor_notes, created_at
       FROM measurement_submissions
       ORDER BY created_at DESC`
    );

    return res.json({ ok: true, orders: result.rows });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Could not fetch orders" });
  }
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Route not found: ${req.method} ${req.path}` });
});

async function bootstrap() {
  await initDb();
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Startup failed:", error);
  process.exit(1);
});
