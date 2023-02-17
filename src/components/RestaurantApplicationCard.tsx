import { RestaurantApplication } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { api } from "../utils/api";

import Image from "next/image";
const RestaurantApplicationCard = (props: {
  restaurant: RestaurantApplication;
}) => {
  const { restaurant } = props;

  const userName = api.user.getUsername.useQuery({
    id: restaurant.created_by_user_id,
  });
  const photos = api.photo.getByApplicationId.useQuery({
    id: restaurant.id,
  });
  return (
    <div className=" overflow-hidden rounded-lg bg-white p-4 shadow-lg">
      {photos.data && photos.data.length > 0 && (
        <Image
          height={240}
          width={240}
          src={photos.data ? String(photos.data.at(0)?.photoUrl) : ""}
          alt="Restaurant Image"
        />
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{restaurant.name}</h3>
        <div>
          <h2 className="text-l ">
            Created: {restaurant.created_at.toLocaleDateString()}
          </h2>
          <Link href={`/user/${restaurant.created_by_user_id}`}>
            <h2 className="text-l ">Created by: {userName.data}</h2>
          </Link>
        </div>
      </div>
      <div className={`mt-4`}>
        <p className="text-gray-700">
          <strong>Cuisine:</strong> {restaurant.cuisineType}
        </p>
        <p className="text-gray-700">
          <strong>Address:</strong> {restaurant.address}
        </p>
        <p className="text-gray-700">
          <strong>City:</strong> {restaurant.cityName}
        </p>
        <p className="text-gray-700">
          <strong>State:</strong> {restaurant.stateName}
        </p>
        <p className="text-gray-700">
          <strong>Zip Code:</strong> {restaurant.zipCode}
        </p>
        <p className="text-gray-700">
          <strong>Phone:</strong> {restaurant.phone}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {restaurant.email}
        </p>
        <p className="text-gray-700">
          <strong>Hours:</strong> {restaurant.hoursInterval}
        </p>
      </div>
    </div>
  );
};

export default RestaurantApplicationCard;
