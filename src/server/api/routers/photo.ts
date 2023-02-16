import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.photo.findMany();
  }),

  getByRestaurantId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.photo.findMany({
        where: {
          restaurant_id: input.id,
        },
      });
      // return ctx.prisma.photo.deleteMany();
    }),
  getByCommentId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.photo.findMany({
        where: {
          comment_id: input.id,
        },
      });
    }),
  createPhoto: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string(),
        restaurantId: z.string().optional(),
        commentId: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.photo.create({
        data: {
          photoUrl: input.photoUrl,
          restaurant_id: input.restaurantId,
          comment_id: input.commentId,
        },
      });
    }),
});
