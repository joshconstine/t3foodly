import RestaurantCard from "../../components/RestaurantCards/RestaurantCard";
import { RestaurantWithCuisines } from "../../server/api/routers/restaurant";

interface IResultsProps {
  restaurants: RestaurantWithCuisines[] | undefined;
}
const RestaurantResults = ({ restaurants }: IResultsProps) => {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 md:p-4">
      {restaurants?.map((elem) => {
        return <RestaurantCard restaurant={elem} key={elem.id} />;
      })}
    </div>
  );
};

export default RestaurantResults;
