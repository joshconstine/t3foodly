import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const reportedPhotoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.reportedPhoto.findMany();
  }),

  createReportedPhoto: protectedProcedure
    .input(
      z.object({
        photoId: z.string(),
        restaurantId: z.string().optional(),
        commentId: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.reportedPhoto.create({
        data: {
          photo_id: input.photoId,
          restaurant_id: input.restaurantId,
          comment_id: input.commentId,
        },
      });
    }),

  // delete: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(({ input, ctx }) => {
  //     return ctx.prisma.photo.deleteMany({
  //       where: {
  //         id: input.id,
  //       },
  //     });
  //   }),
});
