import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.menu.findMany();
  }),

  getByRestaurantId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.menu.findMany({
        where: {
          restaurant_id: input.id,
        },
      });
    }),

  createMenu: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string(),
        restaurantId: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.menu.create({
        data: {
          photoUrl: input.photoUrl,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.menu.deleteMany({
        where: {
          id: input.id,
        },
      });
    }),
});
