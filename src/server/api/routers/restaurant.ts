import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { RestaurantRequest } from "./restaurantApplication";

const Restaurant = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  stateName: z.string(),
  cityName: z.string(),
  zipCode: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  hoursInterval: z.string(),
  cuisineType: z.string(),
});

export type RestaurantData = z.infer<typeof Restaurant>;

export const restaurantRouter = createTRPCRouter({
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
            ? response.data.restaurants.map((elem: RestaurantData) => {
                return {
                  id: elem.id,
                  name: elem.name,
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
    .output(z.array(Restaurant))
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
            ? response.data.restaurants.map((elem: RestaurantData) => {
                return {
                  id: elem.id,
                  name: elem.name,
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
  createRestaurant: protectedProcedure
    .input(RestaurantRequest)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.restaurant.create({
        data: {
          name: input.name,
          address: input.address,
          cityName: input.cityName,
          stateName: input.stateName,
          zipCode: input.zipCode,
          email: input.email,
          phone: input.phone,
          website: input.website,
          hoursInterval: input.hoursInterval,
          cuisineType: input.cuisineType,
        },
      });
    }),
});
