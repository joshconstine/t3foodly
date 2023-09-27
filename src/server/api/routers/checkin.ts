
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const checkInRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.checkIn.findMany();
  }),

  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.checkIn
        .findMany({
          where: {
            user_id: input.id,
          },
        })  
    }),
  getNumberOfCheckIns: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.checkIn
        .findMany({
          where: {
            restaurant_id: input.restaurantId,
          },
        })
        .then((checkIns) => {
          return checkIns.length;
        });
    }),
  createCheckIn: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.checkIn.create({
        data: {
          user_id: ctx.session.user.id,
          restaurant_id: input.restaurantId,
        },
      });
    }),
});
