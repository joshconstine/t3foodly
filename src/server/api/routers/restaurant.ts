import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
    restaurantGreeting: publicProcedure
        .query(() => {
            return {
                greeting: `Hello from restaurants`,
            };
        }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.restaurant.findMany()
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input, ctx }) => {
        return ctx.prisma.restaurant.findUnique({
            where: {
                id: input.id
            }
        })
    }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
