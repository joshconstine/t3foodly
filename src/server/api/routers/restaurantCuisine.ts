import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const restaurantCuisineRouter = createTRPCRouter({
  getByRestaurantId: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.restaurantCuisine.findMany({
        where: {
          restaurant_id: input.restaurantId,
        },
      });
    }),
  createRestaurantCuisine: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        cuisines: z.array(z.object({ id: z.string(), name: z.string() })),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.restaurantCuisine.createMany({
        data: input?.cuisines?.map((cuisine) => ({
          restaurant_id: input.restaurantId,
          cuisine_id: cuisine.id,
        })),
        skipDuplicates: true,
      });
    }),
  deleteByRestaurant: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.restaurantCuisine.deleteMany({
        where: {
          restaurant_id: input.restaurantId,
        },
      });
    }),
});
