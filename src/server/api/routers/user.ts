import { Session } from "inspector";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user.id,
      },
    });
  }),
  getUsername: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user
        .findUnique({
          where: {
            id: input.id,
          },
        })
        .then((value) => {
          return value?.username;
        })
        .catch((e) => {
          return "";
        });
    }),
  getUserPageData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user
        .findUnique({
          where: {
            id: input.id,
          },
        })
        .then((value) => {
          return { username: value?.username, favorites: ["2", "1"] };
        });
    }),
  updateUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
        },
      });
    }),
  updateRole: protectedProcedure
    .input(z.object({ role: z.enum(["USER", "ADMIN"]) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          role: input.role,
        },
      });
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
