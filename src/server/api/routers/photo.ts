import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.photo.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.photo.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getByRestaurantId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.photo.findMany({
        where: {
          restaurant_id: input.id,
        },
      });
      // return ctx.prisma.photo.deleteMany();
    }),
  getByApplicationId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.photo.findMany({
        where: {
          application_id: input.id,
        },
      });
    }),
  getByCommentId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.photo.findMany({
        where: {
          comment_id: input.id,
        },
      });
    }),
  createPhoto: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string(),
        restaurantId: z.string().optional(),
        applicationId: z.string().optional(),
        commentId: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.photo.create({
        data: {
          photoUrl: input.photoUrl,
          restaurant_id: input.restaurantId,
          comment_id: input.commentId,
          application_id: input.applicationId,
        },
      });
    }),
  handlePublish: publicProcedure
    .input(z.object({ applicationId: z.string(), restaurantId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.photo.updateMany({
        where: {
          application_id: input.applicationId,
        },
        data: {
          application_id: undefined,
          restaurant_id: input.restaurantId,
        },
      });
    }),
  deleteByApplication: publicProcedure
    .input(z.object({ applicationid: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.photo.deleteMany({
        where: {
          application_id: input.applicationid,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.photo.deleteMany({
        where: {
          id: input.id,
        },
      });
    }),
});
