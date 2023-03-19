import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const usersRestaurant = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.usersRestaurant.findMany();
  }),

  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.usersRestaurant.findMany({
        where: {
          user_id: input.id,
        },
      });
    }),
  isRestaurantAUsers: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.usersRestaurant
        .findMany({
          where: {
            user_id: ctx.session?.user.id || "923929292929",
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

  addUsersRestaurant: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.usersRestaurant.create({
        data: {
          user_id: input.userId,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.usersRestaurant.deleteMany({
        where: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
});
