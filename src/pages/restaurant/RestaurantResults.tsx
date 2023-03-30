import RestaurantCard from "../../components/RestaurantCards/RestaurantCard";
import { RestaurantWithCuisines } from "../../server/api/routers/restaurant";

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
