"use client";
import { Restaurant } from "@prisma/client";
import React, { useEffect } from "react";
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
import axios from "axios";
import { blob } from "aws-sdk/clients/codecommit";
import { AstPath } from "prettier";
import { Base64EncodedString } from "aws-sdk/clients/elastictranscoder";
const RestaurantCard = (props: { restaurant: IGoogleRestaurantResult }) => {
  const router = useRouter();
  const { restaurant } = props;
  // const photos = api.restaurant.getPhotoByReference.useQuery({
  //   photoReference: restaurant?.photos
  //     ? restaurant.photos[0]?.photo_reference || ""
  //     : "",
  // });
  const [image, setImage] = React.useState<string | null>(null);
  const fetchImage = async () => {
    const photoRef = restaurant.photos[0]?.photo_reference;
    console.log(photoRef);
    if (photoRef) {
      const imageLookupURL = `https://cors-anywhere-joshua-bde035a7e39c.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&key=AIzaSyCBwAl-oMbcVnn9rgq7ScpnZMnA8E92vsw&maxwidth=700&maxheight=700`;
      const imageURLQuery = await fetch(imageLookupURL)
        .then((r) => r.blob())
        .catch(console.error);
      //@ts-ignore
      setImage(URL.createObjectURL(imageURLQuery)); //declared earlier
      // photoContainer?.appendChild(image);
    }
  };

  // const [image, setImage] = React.useState<string | null>(null);
  useEffect(() => {
    fetchImage();
  }, [restaurant]);
  // const fetchImageByReference = async (photoReference: string) => {
  //   const options: any = {
  //     method: "GET",
  //     cors: "*",
  //     // url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restautant=${input.lat}%2C${input.lng}&radius=${input.radius}&key=AIzaSyCBwAl-oMbcVnn9rgq7ScpnZMnA8E92vsw`,
  //     url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=AIzaSyCBwAl-oMbcVnn9rgq7ScpnZMnA8E92vsw`,
  //   };

  //   return axios
  //     .request(options)
  //     .then(function (response) {
  //       return `data:image/jpeg;base64,${response.data}`;
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //       return [];
  //     });
  // };

  // const fetchImage = async () => {
  //   image = await fetchImageByReference(
  //     restaurant.photos[0]?.photo_reference || ""
  //   );
  // };
  // Assuming 'googleImage' contains your fetched image data

  // useEffect(() => {
  //   if (restaurant?.photos) {
  //     fetchImage();
  //   }
  // }, [restaurant?.photos]);

  return (
    <div
      className=" h-32 cursor-pointer "
      onClick={() => router.push(`restaurant/${restaurant.id}`)}
    >
      <div className="flex gap-1">
        <div className="flex flex-col items-center gap-4" id="photoContainer">
          <Image
            width={100}
            height={100}
            className="rounded-md"
            src={
              image || "/static/photos/yum.png"
              // photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"
            }
            alt="Yum"
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
