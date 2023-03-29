import { Cuisine, Restaurant } from "@prisma/client";
import { useState } from "react";
import MinimalRestaurantCard from "../../components/RestaurantCards/MinimalRestaurantCard";
import RestaurantCard from "../../components/RestaurantCards/RestaurantCard";
import { RestaurantWithCuisines } from "../../server/api/routers/restaurant";
import { api } from "../../utils/api";
import CuisineFilter from "./CuisineFilter";

interface IResultsProps {
  restaurants: RestaurantWithCuisines[] | undefined;
}
const RestaurantResults = ({ restaurants }: IResultsProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-16 p-4 md:grid-cols-2 md:gap-4">
        {restaurants?.map((elem) => {
          return <RestaurantCard restaurant={elem} key={elem.id} />;
        })}
      </div>
    </div>
  );
};

export default RestaurantResults;
