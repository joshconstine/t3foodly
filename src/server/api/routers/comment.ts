import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
const Comment = z.object({
  id: z.string(),
  name: z.string(),
  text: z.string(),
  created_at: z.string(),
  user_id: z.string(),
  restaurant_id: z.string(),
});

export type Comment = z.infer<typeof Comment>;
export const commentRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findMany();
  }),
  getRecent: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }),

  getByRestaurantId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.comment.findMany({
        where: {
          restaurant_id: input.id,
        },
      });
    }),
  createComment: protectedProcedure
    .input(z.object({ text: z.string(), restaurantId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.comment.create({
        data: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
          text: input.text,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
