import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const Favorite = ({ restaurantId }: { restaurantId: string }) => {
  const router = useRouter();
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  return (
    <div
      className="flex cursor-pointer gap-8 bg-gray-100 px-2 py-4"
      onClick={() => router.push(`/restaurant/${restaurantId}`)}
    >
      <div className="text-lg font-bold">{restaurant.data?.name}</div>
      <div className="text-sm">{restaurant.data?.cityName}</div>
    </div>
  );
};

export default Favorite;
