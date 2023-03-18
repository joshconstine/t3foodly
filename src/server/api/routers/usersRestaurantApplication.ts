import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const UsersRestaurantRequest = z.object({
  restaurantId: z.string(),
});
export const usersRestaurantApplicationRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.usersRestaurantApplication.findMany({
      where: {
        OR: [
          {
            status: "new",
          },
          {
            status: "updated",
          },
        ],
      },
      orderBy: {
        created_at: "asc",
      },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.usersRestaurantApplication.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  createUsersRestaurantApplication: protectedProcedure
    .input(UsersRestaurantRequest)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.usersRestaurantApplication.create({
        data: {
          restaurant_id: input.restaurantId,
          status: "new",
          created_by_user_id: ctx.session.user.id,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.usersRestaurantApplication.delete({
        where: {
          id: input.applicationId,
        },
      });
    }),
});
