"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {  PlaceDetailsResult } from "../../server/api/routers/restaurant";

const RestaurantCardWithCheckIns = (props: {
  restaurant: PlaceDetailsResult;
  checkIns:number
}) => {
  const router = useRouter();
  const { restaurant, checkIns  } = props;

  const [image, setImage] = React.useState<string | null>(null);
  const fetchImage = async () => {
    if (!restaurant || !restaurant.photos || restaurant.photos.length === 0) return;
    const photoRef = restaurant.photos[0]?.photo_reference;
    if (photoRef) {
      const imageLookupURL = `https://cors-anywhere-joshua-bde035a7e39c.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&key=AIzaSyCBwAl-oMbcVnn9rgq7ScpnZMnA8E92vsw&maxwidth=700&maxheight=700`;
      const imageURLQuery = await fetch(imageLookupURL)
        .then((r) => r.blob())
        .catch(console.error);
      //@ts-ignore
      setImage(URL?.createObjectURL(imageURLQuery)); //declared earlier
    }
  };
  useEffect(() => {
    fetchImage();
  }, [restaurant]);
const cityName = restaurant?.address_components?.find((el)=>el.types.includes('locality'))?.long_name
const  stateName = restaurant?.address_components?.find((el)=>el.types.includes('administrative_area_level_1'))?.long_name
  return ( 
    <div
      className="  cursor-pointer border-secondary border-2  p-4 rounded-lg"
      onClick={() => router.push(`restaurant/new/${restaurant?.place_id}`)}
    >
      <div className="flex  flex-col-reverse items-center gap-8 md:flex-row">
        <div className="flex flex-col items-center gap-1" id="photoContainer">
          <Image
            width={200}
            height={200}
            className="rounded-md"
            src={image || "/static/photos/yum.png"}
            alt="Yum"
          />

        
        </div>
        <div className="flex flex-col gap-1">
          <div className="md:ap-2 flex  items-center gap-4">
            <h3 className="text-md font-bold  md:text-xl">
              {restaurant?.name}
            </h3>
          </div>{" "}
          <span className="text-xs">{cityName}, {stateName} </span>
           <span>
            {checkIns}: Check ins today
           </span>
         
        
         
          {restaurant?.opening_hours?.open_now && (
            <div className="flex gap-4 text-xs text-green-500">
              <strong>Open Now</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCardWithCheckIns;
