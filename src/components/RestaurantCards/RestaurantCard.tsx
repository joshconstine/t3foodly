import { Restaurant } from "@prisma/client";
import React from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import UpVoteDownVote from "./UpVoteDownVote";
import { RestaurantWithCuisines } from "../../server/api/routers/restaurant";
const RestaurantCard = (props: { restaurant: RestaurantWithCuisines }) => {
  const router = useRouter();
  const { restaurant } = props;

  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurant.id });

  return (
    <div
      className=" cursor-pointer"
      onClick={() => router.push(`restaurant/${restaurant.id}`)}
    >
      <div className="flex gap-1">
        <Image
          width={100}
          height={100}
          src={photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"}
          alt="Yum"
          className="relative rounded-lg"
          z-index={0}
        />
        <div>
          <div className="md:ap-2 flex flex-col justify-between ">
            <h3 className="text-md whitespace-nowrap font-bold md:text-xl">
              {restaurant.name}
            </h3>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <UpVoteDownVote restaurantId={restaurant.id} />
            </div>
          </div>
          {restaurant?.address && (
            <div>
              <span className="text-xs">{`${restaurant?.address} ${restaurant.cityName}`}</span>
            </div>
          )}
          <div>
            <span className="text-xs">{restaurant.phone}</span>
          </div>
          <div className="flex gap-2">
            {restaurant?.cuisines?.map((cuisine) => {
              return <div>{cuisine.cuisine.name}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
