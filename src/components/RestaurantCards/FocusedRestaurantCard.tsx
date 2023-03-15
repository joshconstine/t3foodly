import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import UpVoteDownVote from "./UpVoteDownVote";
import { IRestaurantData } from "./MinimalRestaurantCard";
import MinimalCommentCard from "../MinimalCommentCard";
const FocusedRestaurantCard = (props: { restaurantId: string }) => {
  const { restaurantId } = props;
  const router = useRouter();
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurantId });
  const [singleResraurantData, setSingleRestaurantData] =
    useState<IRestaurantData | null>(null);
  const comments = api.comment.getByRestaurantId.useQuery({
    id: String(restaurantId),
  });

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

  if (restaurant.status === "loading" || photos.status === "loading") {
    return <div>Loading...</div>;
  }
  console.log(singleResraurantData);
  return (
    <div className=" h-64">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <Image
          width={220}
          height={220}
          src={photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"}
          alt="Yum"
          className="relative rounded-lg"
          z-index={0}
        />
        <div>
          <div className="flex gap-2">
            <h3 className="text-xl font-bold">
              {restaurant.data?.name
                ? restaurant.data.name
                : singleResraurantData?.name}
            </h3>
            <UpVoteDownVote restaurantId={restaurantId} />
          </div>
          <div className={`$ mt-4`}>
            <button
              className="rounded-full bg-primary py-2 px-4 font-bold text-white"
              onClick={() => router.push(`restaurant/${restaurantId}`)}
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
