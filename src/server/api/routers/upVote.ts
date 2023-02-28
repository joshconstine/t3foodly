import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const upVoteRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.upVote.findMany();
  }),

  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.upVote.findMany({
        where: {
          user_id: input.id,
        },
      });
    }),
  isRestaurantUpVoted: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.upVote
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
  getNumberOfUpVotes: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.upVote
        .findMany({
          where: {
            restaurant_id: input.restaurantId,
          },
        })
        .then((upVotes) => {
          return upVotes.length;
        });
    }),
  createUpVote: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.upVote.create({
        data: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.upVote.deleteMany({
        where: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
});
