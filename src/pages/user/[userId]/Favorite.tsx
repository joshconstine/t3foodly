import Link from "next/link";
import { api } from "../../../utils/api";

const Favorite = ({ restaurantId }: { restaurantId: string }) => {
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  return (
    <div>
      <Link href={`/restaurant/${restaurantId}`}>{restaurant.data?.name}</Link>
    </div>
  );
};

export default Favorite;
