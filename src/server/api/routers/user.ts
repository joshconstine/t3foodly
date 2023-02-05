import { Session } from "inspector";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({



    getUser: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: ctx.session?.user.id
            }
        })
    }),
    updateUsername: protectedProcedure.input(z.object({ username: z.string() })).mutation(({ input, ctx }) => {
        return ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id
            }, data: {
                username: input.username
            }
        }
        )
    }),
    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});


