import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const favoriteRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.favorite.findMany();
  }),

  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.favorite
        .findMany({
          where: {
            user_id: input.id,
          },
        })
        .then((favorites) => {
          return favorites.sort((a, b) => {
            if (a.placement && b.placement) {
              return a.placement - b.placement;
            } else if (a.placement) {
              return -1;
            } else if (b.placement) {
              return 1;
            } else {
              return 0;
            }
          });
        });
    }),
  isRestaurantFavorited: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.favorite
        .findMany({
          where: {
            user_id: ctx.session.user.id,
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
  getNumberOfFavorites: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.favorite
        .findMany({
          where: {
            restaurant_id: input.restaurantId,
          },
        })
        .then((favorites) => {
          return favorites.length;
        });
    }),
  createFavorite: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        placement: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.favorite.create({
        data: {
          user_id: ctx.session.user.id,
          restaurant_id: input.restaurantId,
          placement: input.placement,
        },
      });
    }),
  updateFavorite: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        placement: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.favorite.updateMany({
        where: {
          user_id: ctx.session.user.id,
          restaurant_id: input.restaurantId,
        },
        data: {
          placement: input.placement,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.favorite.deleteMany({
        where: {
          user_id: ctx.session.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
