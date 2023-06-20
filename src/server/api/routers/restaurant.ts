import { Prisma } from "@prisma/client";
import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
  lat: z.number(),
  lng: z.number(),
});
const RestaurantToCreate = z.object({
  name: z.string(),
  address: z.string(),
  stateName: z.string(),
  cityName: z.string(),
  zipCode: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  hoursInterval: z.string(),
  lat: z.string(),
  lng: z.string(),
});

export type RestaurantData = z.infer<typeof Restaurant>;
export const restaurantWithCuisines = Prisma.validator<Prisma.RestaurantArgs>()(
  {
    select: {
      id: true,
      name: true,
      cityName: true,
      stateName: true,
      cuisines: {
        include: {
          cuisine: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  }
);
export type RestaurantWithCuisines = Prisma.RestaurantGetPayload<
  typeof restaurantWithCuisines
>;
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
          name: z.string(),
          id: z.number(),
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
            ? response.data.restaurants.map((elem: any) => {
                return {
                  id: elem.id,
                  name: elem.restaurantName,
                  address: elem.address,
                  cityName: elem.cityName,
                  stateName: elem.stateName,
                  zipCode: elem.zipCode,
                  phone: elem.phone,
                  email: elem.email,
                  hoursInterval: elem.hoursInterval,
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
            ? response.data.restaurants.map((elem: any) => {
                return {
                  id: elem.id,
                  name: elem.restaurantName,
                  address: elem.address,
                  cityName: elem.cityName,
                  stateName: elem.stateName,
                  zipCode: elem.zipCode,
                  phone: elem.phone,
                  email: elem.email,
                  hoursInterval: elem.hoursInterval,
                  lat: elem.latitude,
                  lng: elem.longitude,
                };
              })
            : [];
        })
        .catch(function (error) {
          console.error(error);
          return [];
        });
    }),
  getByCityAndStateFromDB: publicProcedure
    .input(
      z.object({ city: z.string().nullable(), state: z.string().nullable() })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.restaurant.findMany({
        where: {
          AND: [
            {
              cityName: input.city || "****",
            },
            { stateName: input.state || "*****" },
          ],
        },
      });
    }),
  getByLatLong: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        searchRadiusInMeters: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.$queryRaw`SELECT *,
      (6371000 * Acos (Cos (Radians(${input.latitude})) * Cos(Radians(lat)) *
                        Cos(Radians(lng) - Radians(${input.longitude}))
                          + Sin (Radians(${input.latitude})) *
                            Sin(Radians(lat)))
              ) AS distance_m
      FROM   Restaurant
      HAVING distance_m < ${input.searchRadiusInMeters}
      ORDER  BY distance_m;`;
    }),
  getByCityAndStateFromDBMinimal: publicProcedure
    .input(z.object({ city: z.string(), state: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.restaurant.findMany({
        where: {
          AND: [
            {
              cityName: input.city,
            },
            { stateName: input.state },
          ],
        },

        select: {
          id: true,
          name: true,
          cityName: true,
          stateName: true,
          cuisines: {
            include: {
              cuisine: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }),
  isCreated: publicProcedure
    .input(
      z.object({
        city: z.string().nullable(),
        state: z.string().nullable(),
        name: z.string().nullable(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.restaurant.findMany({
        where: {
          AND: [
            {
              cityName: input.city || "****",
            },
            { stateName: input.state || "*****" },
            { name: input.name || "*****" },
          ],
        },
      });
    }),
  createRestaurant: protectedProcedure
    .input(RestaurantToCreate)
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
          lat: `${input.lat}`,
          lng: `${input.lng}`,
        },
      });
    }),
  updateRestaurant: protectedProcedure
    .input(Restaurant)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.restaurant.update({
        where: {
          id: input.id,
        },
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
          lat: `${input.lat}`,
          lng: `${input.lng}`,
        },
      });
    }),
});
