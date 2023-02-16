import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const favoriteRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.favorite.findMany();
  }),

  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.favorite.findMany({
        where: {
          user_id: input.id,
        },
      });
    }),
  isRestaurantFavorited: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.favorite.findMany({
        where: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  createFavorite: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        placement: z.number().min(1).max(10),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.favorite.create({
        data: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
          placement: input.placement,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.favorite.deleteMany({
        where: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
