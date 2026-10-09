import { createInsertSchema } from "drizzle-zod";
import { timeline } from "../db/schema.js";
import { orderSchema, toUpdateSchema } from "./shared.js";

// Étape du parcours (formation, expérience…)
export type TimelineItem = typeof timeline.$inferSelect;
export type NewTimelineItem = typeof timeline.$inferInsert;

export const createTimelineItemSchema = createInsertSchema(timeline, {
  order: orderSchema,
}).omit({ id: true });

export const updateTimelineItemSchema = toUpdateSchema(createTimelineItemSchema);
