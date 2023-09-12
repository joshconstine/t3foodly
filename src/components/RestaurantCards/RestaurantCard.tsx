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
import FavoriteSaveGoogle from "./FavoriteSaveGoogle";

const RestaurantCard = (props: {
  restaurant: IGoogleRestaurantResult;
  index: number;
}) => {
  const router = useRouter();
  const { restaurant, index } = props;

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
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-1" id="photoContainer">
          <Image
            width={200}
            height={200}
            className="rounded-md"
            src={image || "/static/photos/yum.png"}
            alt="Yum"
          />

          <div className=" flex items-center gap-4 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">
            <span className="whitespace-nowrap text-xs ">Chat Room</span>
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          </div>
          <Stars numStars={restaurant.rating} />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="md:ap-2 flex  items-center gap-4">
            <h3 className="text-md whitespace-nowrap font-bold md:text-xl">
              {index}. {restaurant.name}
            </h3>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <FavoriteSaveGoogle placeId={restaurant.id} />
            </div>
          </div>{" "}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <UpVoteDownVote restaurantId={restaurant.id} />
          </div>
          <div className="flex gap-4">
            <button className="btn-rounded btn-secondary btn-sm  btn w-32 rounded-full">
              menu
            </button>{" "}
            <button className="btn-rounded btn-secondary btn-sm  btn w-32 rounded-full">
              photos
            </button>
          </div>
          {restaurant?.address && (
            <div className="flex gap-4 text-xs">
              <strong>Address: </strong>
              <a className="underline">{`${restaurant?.address} `}</a>
            </div>
          )}
          {restaurant.opening_hours?.open_now && (
            <div className="flex gap-4 text-xs text-green-500">
              <strong>Open Now</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
