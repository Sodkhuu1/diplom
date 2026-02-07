import { z } from "zod";

const positive = z.number().positive();

export const measurementSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email().max(200),
  unit: z.enum(["cm", "in"]),
  valuesCm: z.object({
    chest: positive,
    waist: positive,
    hips: positive,
    shoulder: positive,
    sleeve: positive,
    height: positive
  })
});
