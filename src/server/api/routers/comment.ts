import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({


    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.comment.findMany()
    }),

    getByRestaurantId: publicProcedure.input(z.object({ id: z.number() })).query(({ input, ctx }) => {
        return ctx.prisma.comment.findMany({
            where: {
                restaurant_id: input.id
            }
        })
    }),
    createComment: protectedProcedure.input(z.object({ text: z.string(), restaurantId: z.number() })).mutation(({ input, ctx }) => {
        return ctx.prisma.comment.create({
            data: {
                user_id: ctx.session?.user.id,
                restaurant_id: input.restaurantId,
                text: input.text,
            }

        })
    }),
    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});

