import Link from "next/link";
import { api } from "../../utils/api";

const Favorite = ({ restaurantId }: { restaurantId: string }) => {
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  return (
    <div>
      <div>{restaurant.data?.name}</div>
    </div>
  );
};

export default Favorite;
