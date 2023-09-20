import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import UpVoteDownVote from "./UpVoteDownVote";
import { IRestaurantData } from "./MinimalRestaurantCard";
import MinimalCommentCard from "../MinimalCommentCard";
import { RestaurantCardSkeleton } from "../../pages/restaurant";
const FocusedRestaurantCard = (props: { restaurantId: string }) => {
  const { restaurantId } = props;
  const router = useRouter();
  const restaurant = api.restaurant.getByPlaceId.useQuery({
    placeId: restaurantId,
  });
  const [singleResraurantData, setSingleRestaurantData] =
    useState<IRestaurantData | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const comments = api.comment.getByRestaurantId.useQuery({
    id: String(restaurantId),
  });
  const fetchImages = async () => {
    if (!restaurant.data?.photos || restaurant.data?.photos?.length === 0)
      return;

    const retunredPhotos = restaurant.data?.photos.map(async (photo) => {
      const photoRef = photo?.photo_reference;
      if (photoRef) {
        const imageLookupURL = `https://cors-anywhere-joshua-bde035a7e39c.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&key=AIzaSyCBwAl-oMbcVnn9rgq7ScpnZMnA8E92vsw&maxwidth=700&maxheight=700`;
        const imageURLQuery = await fetch(imageLookupURL)
          .then((r) => r.blob())
          .catch(console.error);
        //@ts-ignore
        return URL.createObjectURL(imageURLQuery); //declared earlier
      }
    });
    //wait for all photo promises to resolve then set images
    const photosToSet = await Promise.allSettled(retunredPhotos);
    //@ts-ignore
    const returned = photosToSet.map((e) => e.value);
    if (photosToSet) {
      setImages(returned || []);
      setSelectedImage(0);
    }
  };
  useEffect(() => {
    fetchImages();
  }, [restaurant?.data]);
  useEffect(() => {
    const restaurantJSON: string | null =
      localStorage?.getItem("restaurants") || null;
    // const restaurantJSON = `{ "empty": "yes" }`;

    const newSngleResraurantData: IRestaurantData | null = JSON.parse(
      restaurantJSON ? restaurantJSON : ""
    )?.find((elem: IRestaurantData) => {
      return elem.id === Number(restaurantId);
    });
    setSingleRestaurantData(newSngleResraurantData);
  }, [restaurantId]);

  if (restaurant.status === "loading") {
    return (
      <div className="h-64">
        <RestaurantCardSkeleton />
      </div>
    );
  }
  return (
    <div className=" flex h-64 flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex items-center gap-1">
          <button
            className="btn-secondary btn-outline btn rounded-full"
            onClick={() => {
              setSelectedImage(selectedImage - 1);
            }}
            disabled={selectedImage === 0}
          >
            {`<`}
          </button>{" "}
          <Image
            width={220}
            height={220}
            src={images ? images[selectedImage] : "/static/photos/yum.png"}
            alt="Yum"
            className="relative rounded-lg"
            z-index={0}
          />
          <button
            className="btn-secondary btn-outline btn rounded-full"
            onClick={() => setSelectedImage(selectedImage + 1)}
            disabled={selectedImage === images?.length - 1}
          >
            {`>`}
          </button>
        </div>
        <div>
          <div className="flex gap-2">
            <h3 className="text-xl font-bold">
              {restaurant.data?.name
                ? restaurant.data.name
                : singleResraurantData?.name}
            </h3>
          </div>
          <div className={`$ mt-4`}>
            <button
              className="btn-primary btn rounded-full"
              onClick={() => router.push(`restaurant/new/${restaurantId}`)}
            >
              details
            </button>
          </div>{" "}
          {comments.data && comments.data.length > 0 && (
            <MinimalCommentCard comment={comments.data[0]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusedRestaurantCard;
