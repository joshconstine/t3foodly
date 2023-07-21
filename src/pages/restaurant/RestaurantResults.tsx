import RestaurantCard from "../../components/RestaurantCards/RestaurantCard";
import { RestaurantWithCuisines } from "../../server/api/routers/restaurant";

interface IResultsProps {
  restaurants: RestaurantWithCuisines[] | undefined;
}
const RestaurantResults = ({ restaurants }: IResultsProps) => {
  return (
    <div className=" flex flex-wrap gap-4">
      {restaurants?.map((elem) => {
        return <RestaurantCard restaurant={elem} key={elem.id} />;
      })}
    </div>
  );
};

export default RestaurantResults;
