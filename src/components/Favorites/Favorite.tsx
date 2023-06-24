import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { motion } from "framer-motion";

import Image from "next/image";
const Favorite = ({ restaurantId }: { restaurantId: string }) => {
  const router = useRouter();
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurantId });
  return (
    <div
      className="flex cursor-pointer  bg-gray-100 px-2 py-4"
      onClick={() => router.push(`/restaurant/${restaurantId}`)}
    >
      <Image
        width={140}
        height={140}
        src={photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"}
        alt="Yum"
        className="relative rounded-lg"
        z-index={0}
      />
      <div className="m-4">
        <div className=" text-lg font-bold">{restaurant.data?.name}</div>
        <div className="text-sm">{restaurant.data?.cityName}</div>
      </div>
    </div>
  );
};

export default Favorite;
