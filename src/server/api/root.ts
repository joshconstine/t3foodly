import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { restaurantRouter } from "./routers/restaurant";
import { comment } from "postcss";
import { commentRouter } from "./routers/comment";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  restaurant: restaurantRouter,
  comment: commentRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
