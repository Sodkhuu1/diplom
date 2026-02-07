import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { initDb, pool } from "./db.js";
import { measurementSchema } from "./validation.js";

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
    version: 1,
    fields: ["chest", "waist", "hips", "shoulder", "sleeve", "height"],
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
      height_cm
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
    data.valuesCm.height
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
