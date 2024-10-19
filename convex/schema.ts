import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  message: defineTable({
    text: v.string(),
    sender: v.string(),
    supportSide: v.union(v.literal("one-side"), v.literal("second-side")),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
  fights : defineTable({
    
  })
})

