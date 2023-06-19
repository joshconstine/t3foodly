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
  console.log("in restaurant card", restaurant);

  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurant.id });

  return (
    <div
      className="h-64 w-64 cursor-pointer"
      onClick={() => router.push(`restaurant/${restaurant.id}`)}
    >
      <div>
        <Image
          width={400}
          height={400}
          src={photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"}
          alt="Yum"
          className="relative rounded-lg"
          z-index={0}
        />
        <div>
          <div className="flex justify-between gap-2 ">
            <h3 className="text-xl font-bold">{restaurant.name}</h3>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <UpVoteDownVote restaurantId={restaurant.id} />
            </div>
          </div>
          <span>{`${restaurant.cityName}, ${restaurant.stateName}`}</span>
          <div className="flex gap-2">
            {restaurant.cuisines.map((cuisine) => {
              return <div>{cuisine.cuisine.name}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
