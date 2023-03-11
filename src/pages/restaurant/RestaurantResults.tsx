import { Restaurant } from "@prisma/client";
import MinimalRestaurantCard from "../../components/RestaurantCards/MinimalRestaurantCard";
import RestaurantCard from "../../components/RestaurantCards/RestaurantCard";

interface IResultsProps {
  apiRestaurants: Restaurant[] | undefined;
  dbRestaurants: Restaurant[] | undefined;
}
const RestaurantResults = ({
  apiRestaurants,
  dbRestaurants,
}: IResultsProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 md:gap-4">
      {dbRestaurants?.map((elem) => {
        return <RestaurantCard restaurant={elem} key={elem.id} />;
      })}
      {apiRestaurants?.map((elem: Restaurant) => {
        return <MinimalRestaurantCard restaurant={elem} key={elem.id} />;
      })}
    </div>
  );
};

export default RestaurantResults;
