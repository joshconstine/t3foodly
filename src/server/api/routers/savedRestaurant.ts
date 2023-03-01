import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const savedRestaurant = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.savedRestaurants.findMany();
  }),

  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.savedRestaurants.findMany({
        where: {
          user_id: input.id,
        },
      });
    }),
  isRestaurantSaved: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.savedRestaurants
        .findMany({
          where: {
            user_id: ctx.session?.user.id,
            restaurant_id: input.restaurantId,
          },
        })
        .then((value) => {
          if (value.length > 0) {
            return true;
          } else {
            return false;
          }
        });
    }),

  addSavedRestaurant: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.savedRestaurants.create({
        data: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.savedRestaurants.deleteMany({
        where: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
});
