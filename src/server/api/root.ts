import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { restaurantRouter } from "./routers/restaurant";
import { commentRouter } from "./routers/comment";
import { userRouter } from "./routers/user";
import { favoriteRouter } from "./routers/favorite";
import { restaurantApplicationRouter } from "./routers/restaurantApplication";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  restaurant: restaurantRouter,
  restaurantApplication: restaurantApplicationRouter,
  comment: commentRouter,
  user: userRouter,
  favorite: favoriteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
