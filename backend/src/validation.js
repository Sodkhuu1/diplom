import { z } from "zod";

const positive = z.number().positive();
const optionalPositive = z.number().positive().optional();

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
    neck: optionalPositive,
    frontLength: optionalPositive,
    wrist: optionalPositive,
    height: positive
  })
});

export const ORDER_STATUSES = [
  "submitted",
  "reviewed",
  "fabric_selected",
  "cutting",
  "sewing",
  "finishing",
  "ready",
  "delivered"
];

export const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  notes: z.string().max(1000).optional()
});
