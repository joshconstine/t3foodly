import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { motion } from "framer-motion";

import Image from "next/image";
const Favorite = ({
  restaurantId,
  disableClick = false,
}: {
  restaurantId: string;
  disableClick: boolean;
}) => {
  const router = useRouter();
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurantId });
  return (
    <div
      className="flex cursor-pointer gap-2 bg-gray-100 px-2 py-2"
      onClick={() => {
        if (!disableClick) router.push(`/restaurant/${restaurantId}`);
      }}
    >
      <Image
        width={80}
        height={80}
        src={photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"}
        alt="Yum"
        className="relative rounded-lg"
        z-index={0}
      />
      <div className="">
        <div className=" text-lg font-bold">{restaurant.data?.name}</div>
        <div className="text-sm">{restaurant.data?.cityName}</div>
      </div>
    </div>
  );
};

export default Favorite;
