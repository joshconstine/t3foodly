import { Restaurant } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
export interface IRestaurantData {
  cityName: string;
  cuisine: string;
  email: string;
  hoursInterval: string;
  id: number;
  phone: string;
  name: string;
  stateName: string;
  website: string;
  zipCode: string;
  address: string;
  lat: string;
  lng: string;
}

const MinimalRestaurantCard = (props: { restaurant: Restaurant }) => {
  const router = useRouter();
  const { restaurant } = props;
  const createRestaurant = api.restaurant.createRestaurant.useMutation();
  const restaurantId = restaurant.id;

  const [singleResraurantData, setSingleRestaurantData] =
    useState<IRestaurantData | null>(null);
  useEffect(() => {
    const restaurantJSON: string | null =
      localStorage?.getItem("restaurants") || null;
    // const restaurantJSON = `{ "empty": "yes" }`;

    const newSngleResraurantData: IRestaurantData | null = JSON.parse(
      restaurantJSON ? restaurantJSON : ""
    )?.find((elem: IRestaurantData) => {
      return elem.id === Number(restaurantId);
    });
    setSingleRestaurantData(newSngleResraurantData);
  }, []);

  const handleSaveRestaurantData = (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    createRestaurant.mutate(
      {
        name: singleResraurantData?.name ? singleResraurantData?.name : "",
        cityName: singleResraurantData?.cityName
          ? singleResraurantData?.cityName
          : "",
        address: singleResraurantData?.address
          ? singleResraurantData?.address
          : "",

        stateName: singleResraurantData?.stateName
          ? singleResraurantData?.stateName
          : "",
        zipCode: singleResraurantData?.zipCode
          ? singleResraurantData?.zipCode
          : "",
        email: singleResraurantData?.email ? singleResraurantData?.email : "",
        phone: singleResraurantData?.phone ? singleResraurantData?.phone : "",
        website: singleResraurantData?.website
          ? singleResraurantData?.website
          : "",
        hoursInterval: singleResraurantData?.hoursInterval
          ? singleResraurantData?.hoursInterval
          : "",
        cuisineType: singleResraurantData?.cuisine
          ? singleResraurantData?.cuisine
          : "",
        lat: singleResraurantData?.lat ? singleResraurantData?.lat : "",
        lng: singleResraurantData?.lng ? singleResraurantData?.lng : "",
      },
      {
        onSuccess(data) {
          router.push(`restaurant/${data.id}`);
        },
      }
    );
  };

  return (
    <div className=" h-64">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <Image
          width={220}
          height={220}
          src={"/static/photos/yum.png"}
          alt="Yum"
          className="relative rounded-lg"
          z-index={0}
        />
        <div>
          <div className="flex gap-2">
            <h3 className="text-xl font-bold">{restaurant.name}</h3>
          </div>
          <div className={`$ mt-4`}>
            <button
              className="rounded-full bg-primary py-2 px-4 font-bold text-white"
              onClick={handleSaveRestaurantData}
            >
              review
            </button>
            {/* <button
              onClick={handleSaveRestaurantData}
              className="rounded-full bg-primary py-2 px-4 font-bold text-white"
            >
              add to db
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalRestaurantCard;
