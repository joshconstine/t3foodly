import { Restaurant } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";

const RestaurantCard = (props: { restaurant: Restaurant }) => {
  const { restaurant } = props;
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className=" overflow-hidden rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <Link href={`restaurant/${restaurant.id}`}>
          <h3 className="text-xl font-bold">{restaurant.name}</h3>
        </Link>
        <button
          className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={handleClick}
        >
          {expanded ? "Less" : "More"}
        </button>
      </div>
      <div className={`mt-4 ${expanded ? "" : "hidden"}`}>
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

export default RestaurantCard;
