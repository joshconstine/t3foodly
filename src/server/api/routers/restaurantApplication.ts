import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const RestaurantRequest = z.object({
  name: z.string(),
  address: z.string(),
  stateName: z.string(),
  cityName: z.string(),
  zipCode: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  hoursInterval: z.string(),
  cuisineType: z.string(),
});
export const RestaurantApplication = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  stateName: z.string(),
  cityName: z.string(),
  zipCode: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  hoursInterval: z.string(),
  cuisineType: z.string(),
  created_by_user_id: z.string(),
});

export const restaurantApplicationRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.restaurantApplication.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.restaurantApplication.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  createRestaurantApplication: protectedProcedure
    .input(RestaurantRequest)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.restaurantApplication.create({
        data: {
          name: input.name,
          address: input.address,
          cityName: input.cityName,
          stateName: input.stateName,
          zipCode: input.zipCode,
          email: input.email,
          phone: input.phone,
          website: input.website,
          hoursInterval: input.hoursInterval,
          cuisineType: input.cuisineType,
          status: "new",
          created_by_user_id: ctx.session.user.id,
        },
      });
    }),
  updateApplication: publicProcedure
    .input(RestaurantApplication)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.restaurantApplication.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          address: input.address,
          cityName: input.cityName,
          stateName: input.stateName,
          zipCode: input.zipCode,
          email: input.email,
          phone: input.phone,
          website: input.website,
          hoursInterval: input.hoursInterval,
          cuisineType: input.cuisineType,
          status: "updated",
          created_by_user_id: input.created_by_user_id,
        },
      });
    }),
});
