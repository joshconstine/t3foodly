import Link from "next/link";
import { api } from "../../utils/api";

const Favorite = ({ restaurantId }: { restaurantId: string }) => {
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  return (
    <Link href={`/restaurant/${restaurantId}`}>
      <div className="flex  gap-8 bg-gray-100 px-2 py-4">
        <div className="text-lg font-bold">{restaurant.data?.name}</div>
        <div className="text-sm">{restaurant.data?.cityName}</div>
      </div>
    </Link>
  );
};

export default Favorite;
