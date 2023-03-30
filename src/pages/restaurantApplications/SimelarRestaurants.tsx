import MinimalRestaurantCard from "../../components/RestaurantCards/MinimalRestaurantCard";
import { RestaurantApplicationData } from "../../server/api/routers/restaurantApplication";
import { api } from "../../utils/api";

interface IProps {
  city: string;
  state: string;
  name: string;
}

const SimelarRestaurants = (props: IProps) => {
  const SimelarRestaurants = api.restaurant.isCreated.useQuery({
    city: props.city,
    state: props.state,
    name: props.name,
  });

  return (
    <div>
      {SimelarRestaurants.data && SimelarRestaurants.data[0] ? (
        <div>
          <div>{`Found another restaurant nammed ${props.name} in ${props.city}`}</div>
          <MinimalRestaurantCard restaurant={SimelarRestaurants.data[0]} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SimelarRestaurants;
