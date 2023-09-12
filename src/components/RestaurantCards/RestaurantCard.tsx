import { Restaurant } from "@prisma/client";
import React from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import UpVoteDownVote from "./UpVoteDownVote";
import {
  IGoogleRestaurantResult,
  RestaurantWithCuisines,
} from "../../server/api/routers/restaurant";
import FavoriteSaveSmall from "./FavoriteSaveSmall";
import Stars from "./Stars";
const RestaurantCard = (props: { restaurant: IGoogleRestaurantResult }) => {
  const router = useRouter();
  const { restaurant } = props;

  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurant.id });

  return (
    <div
      className=" h-32 cursor-pointer "
      onClick={() => router.push(`restaurant/${restaurant.id}`)}
    >
      <div className="flex gap-1">
        <div className="flex flex-col items-center gap-4">
          <Image
            width={150}
            height={150}
            src={photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"}
            alt="Yum"
            className="relative rounded-lg"
            z-index={0}
          />
          <Stars numStars={restaurant.rating} />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="md:ap-2 flex w-full items-center justify-between ">
            <h3 className="text-md whitespace-nowrap font-bold md:text-xl">
              {restaurant.name}
            </h3>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <FavoriteSaveSmall restaurantId={restaurant.id} />
            </div>
          </div>{" "}
          {restaurant?.address && (
            <div className="text-xs">{`${restaurant?.address} `}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
