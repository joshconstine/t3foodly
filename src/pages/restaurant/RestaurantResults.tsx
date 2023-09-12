import RestaurantCard from "../../components/RestaurantCards/RestaurantCard";
import {
  IGoogleRestaurantResult,
  RestaurantWithCuisines,
} from "../../server/api/routers/restaurant";

interface IResultsProps {
  restaurants: IGoogleRestaurantResult[] | undefined;
}
const RestaurantResults = ({ restaurants }: IResultsProps) => {
  return (
    <div className=" flex flex-col flex-wrap gap-4">
      {restaurants?.map((elem, i) => {
        return (
          <>
            <RestaurantCard restaurant={elem} key={elem.id} index={i + 1} />
            <div className="divider-primary divider my-0"></div>
          </>
        );
      })}
    </div>
  );
};

export default RestaurantResults;
