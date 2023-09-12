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
interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface Geometry {
  location: Location;
  viewport: Viewport;
}

interface OpeningHours {
  open_now: boolean;
}

interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface IGoogleRestaurantResult {
  id: string;
  name: string;
  address: string;
  business_status: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  opening_hours: OpeningHours;
  photos: Photo[];
  place_id: string;
  plus_code: PlusCode;
  rating: number;
  reference: string;
  types: string[];
  user_ratings_total: number;
}

export type RestaurantData = z.infer<typeof Restaurant>;
export const restaurantWithCuisines = Prisma.validator<Prisma.RestaurantArgs>()(
  {
    select: {
      id: true,
      name: true,
      cityName: true,
      stateName: true,
      address: true,
      phone: true,
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
        select: {
          id: true,
          name: true,
          address: true,
          cityName: true,
          zipCode: true,

          phone: true,
          email: true,
          hoursInterval: true,
          lat: true,
          lng: true,
          website: true,
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
      z.object({
        lat: z.string().nullable(),
        lng: z.string().nullable(),
        radius: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      const options = {
        method: "GET",
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restautant=${input.lat}%2C${input.lng}&radius=${input.radius}&key=AIzaSyCBwAl-oMbcVnn9rgq7ScpnZMnA8E92vsw`,
      };

      return axios
        .request(options)
        .then(function (response) {
          return response.data.results
            ? response.data.results.map(
                (elem: any): IGoogleRestaurantResult[] => {
                  return {
                    id: elem.place_id,
                    name: elem.name,
                    address: elem.formatted_address,
                    ...elem,
                  };
                }
              )
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
  //uses the haversine formula to calculate distance between two points
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
