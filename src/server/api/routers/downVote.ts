import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const downVoteRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.downVote.findMany();
  }),

  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.downVote.findMany({
        where: {
          user_id: input.id,
        },
      });
    }),
  isRestaurantDownVoted: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.downVote
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
  getNumberOfDownVotes: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.downVote
        .findMany({
          where: {
            restaurant_id: input.restaurantId,
          },
        })
        .then((downVotes) => {
          return downVotes.length;
        });
    }),
  createDownVote: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.downVote.create({
        data: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.downVote.deleteMany({
        where: {
          user_id: ctx.session?.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
});
