import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

interface IRestaurantData {
  id: number;
  restaurantName: string;
  address: string;
  zipCode: string;
  phone: string;
  website: string;
  email: string;
  latitude: string;
  longitude: string;
  stateName: string;
  cityName: string;
  hoursInterval: string;
  cuisineType: string;
}

export const restaurantRouter = createTRPCRouter({
  restaurantGreeting: publicProcedure.query(() => {
    return {
      greeting: `Hello from restaurants`,
    };
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.restaurant.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.restaurant.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getByZipcode: publicProcedure
    .input(z.object({ zipcode: z.string().nullable() }))
    .output(
      z.array(
        z.object({
          restaurantName: z.string(),
          id: z.number(),
          cuisine: z.string(),
        })
      )
    )
    .query(({ input, ctx }) => {
      const options = {
        method: "GET",
        url: `https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/${input.zipcode}/0`,
        headers: {
          "X-RapidAPI-Key": process.env.XRAPID_KEY,
          "X-RapidAPI-Host": process.env.XRAPID_HOST,
        },
      };

      return axios
        .request(options)
        .then(function (response) {
          return response.data.restaurants
            ? response.data.restaurants.map((elem: IRestaurantData) => {
                return {
                  id: elem.id,
                  restaurantName: elem.restaurantName,
                  cuisine: elem.cuisineType,
                };
              })
            : [];
        })
        .catch(function (error) {
          console.error(error);
          return [];
        });
    }),
  getByCityAndState: publicProcedure
    .input(
      z.object({ city: z.string().nullable(), state: z.string().nullable() })
    )
    .output(
      z.array(
        z.object({
          restaurantName: z.string(),
          id: z.number(),
          cuisine: z.string(),
        })
      )
    )
    .query(({ input, ctx }) => {
      const options = {
        method: "GET",
        url: `https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/state/${
          input.state
        }/city/${encodeURI(input.city ? input.city : "")}/0`,
        headers: {
          "X-RapidAPI-Key": process.env.XRAPID_KEY,
          "X-RapidAPI-Host": process.env.XRAPID_HOST,
        },
      };

      return axios
        .request(options)
        .then(function (response) {
          return response.data.restaurants
            ? response.data.restaurants.map((elem: IRestaurantData) => {
                return {
                  id: elem.id,
                  restaurantName: elem.restaurantName,
                  cuisine: elem.cuisineType,
                };
              })
            : [];
        })
        .catch(function (error) {
          console.error(error);
          return [];
        });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
