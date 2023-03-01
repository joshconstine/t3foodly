import { Reorder } from "framer-motion";
import { useState } from "react";
import Favorite from "../Favorites/Favorite";

interface IContainer {
  list: any;
}
const RestaurantCardContainer = (props: IContainer) => {
  const { list } = props;
  return (
    <div className="w-full px-4 md:w-2/3">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="px-8 py-6">
          <h3 className="mb-2 text-xl font-bold">saved</h3>

          <div className="flex flex-col gap-2">
            {list?.map((elem: any) => {
              return <Favorite restaurantId={elem.restaurant_id} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCardContainer;
