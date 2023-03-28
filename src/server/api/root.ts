import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { restaurantRouter } from "./routers/restaurant";
import { commentRouter } from "./routers/comment";
import { userRouter } from "./routers/user";
import { favoriteRouter } from "./routers/favorite";
import { restaurantApplicationRouter } from "./routers/restaurantApplication";
import { photoRouter } from "./routers/photo";
import { upVoteRouter } from "./routers/upVote";
import { downVoteRouter } from "./routers/downVote";
import { savedRestaurant } from "./routers/savedRestaurant";
import { usersRestaurant } from "./routers/usersRestaurant";
import { usersRestaurantApplicationRouter } from "./routers/usersRestaurantApplication";
import { menuRouter } from "./routers/menu";
import { cuisineRouter } from "./routers/cuisine";
import { restaurantCuisineRouter } from "./routers/restaurantCuisine";

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
  photo: photoRouter,
  upVote: upVoteRouter,
  downVote: downVoteRouter,
  savedRestaurant: savedRestaurant,
  usersRestaurant: usersRestaurant,
  usersRestaurantApplication: usersRestaurantApplicationRouter,
  menu: menuRouter,
  cuisine: cuisineRouter,
  restaurantCuisine: restaurantCuisineRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
