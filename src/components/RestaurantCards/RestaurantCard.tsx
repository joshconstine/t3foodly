"use client";
import { Restaurant } from "@prisma/client";
import React, { useEffect } from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import UpVoteDownVote from "./UpVoteDownVote";
import { IGoogleRestaurantResult } from "../../server/api/routers/restaurant";
import FavoriteSaveSmall from "./FavoriteSaveSmall";
import Stars from "./Stars";

const RestaurantCard = (props: { restaurant: IGoogleRestaurantResult }) => {
  const router = useRouter();
  const { restaurant } = props;

  const [image, setImage] = React.useState<string | null>(null);
  const fetchImage = async () => {
    if (!restaurant.photos || restaurant.photos.length === 0) return;
    const photoRef = restaurant.photos[0]?.photo_reference;
    if (photoRef) {
      const imageLookupURL = `https://cors-anywhere-joshua-bde035a7e39c.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&key=AIzaSyCBwAl-oMbcVnn9rgq7ScpnZMnA8E92vsw&maxwidth=700&maxheight=700`;
      const imageURLQuery = await fetch(imageLookupURL)
        .then((r) => r.blob())
        .catch(console.error);
      //@ts-ignore
      setImage(URL.createObjectURL(imageURLQuery)); //declared earlier
    }
  };
  useEffect(() => {
    fetchImage();
  }, [restaurant]);

  return (
    <div
      className=" cursor-pointer "
      onClick={() => router.push(`restaurant/${restaurant.id}`)}
    >
      <div className="flex gap-1">
        <div className="flex flex-col items-center gap-1" id="photoContainer">
          <Image
            width={200}
            height={200}
            className="rounded-md"
            src={image || "/static/photos/yum.png"}
            alt="Yum"
          />

          <div className=" flex items-center gap-4 rounded-lg bg-gray-200 px-4 py-2">
            <span className="whitespace-nowrap text-xs ">Chat Room</span>
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          </div>
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
