import { Restaurant } from "@prisma/client";
import React from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import UpVoteDownVote from "./UpVoteDownVote";
const RestaurantCard = (props: { restaurant: Restaurant }) => {
  const router = useRouter();
  const { restaurant } = props;

  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurant.id });

  return (
    <div className="h-64">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Image
          width={220}
          height={220}
          src={photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"}
          alt="Yum"
          className="relative rounded-lg"
          z-index={0}
        />
        <div className="flex flex-col items-center">
          <div className="flex gap-2 ">
            <h3 className="text-xl font-bold">{restaurant.name}</h3>
            <UpVoteDownVote restaurantId={restaurant.id} />
          </div>
          <div className={`$ mt-4`}>
            <button
              className="rounded-full bg-primary py-2 px-4 font-bold text-white"
              onClick={() => router.push(`restaurant/${restaurant.id}`)}
            >
              details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
