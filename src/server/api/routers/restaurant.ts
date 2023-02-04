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

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
