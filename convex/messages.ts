import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const messages = query({
  args: {
    paginationOpts: paginationOptsValidator,
    supportSide: v.union(v.literal("one-side"), v.literal("second-side")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("message")
      .filter((item) => item.eq(item.field("supportSide"), args.supportSide))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const send = mutation({
  args: {
    text: v.string(),
    sender: v.string(),
    supportSide: v.union(v.literal("one-side"), v.literal("second-side")),
  },
  handler: async (ctx, { text, sender, supportSide }) => {
    const messageId = await ctx.db.insert("message", {
      text,
      sender,
      supportSide,
      createdAt: Date.now(),
    });
    return messageId;
  },
});

export const groupingNiggasCount = query({
  args: {},
  handler: async (ctx) => {
    const oneSideArray = await ctx.db
      .query("message")
      .filter((item) => item.eq(item.field("supportSide"), "one-side"))
      .collect();

    const secondSideArray = await ctx.db
      .query("message")
      .filter((item) => item.eq(item.field("supportSide"), "second-side"))
      .collect();

    return {
      oneside: oneSideArray.length,
      secondside: secondSideArray.length,
    };
  },
});
