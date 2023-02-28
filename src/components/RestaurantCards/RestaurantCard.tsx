import { Restaurant } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";
import ForwardIcon from "@mui/icons-material/Forward";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
const RestaurantCard = (props: { restaurant: Restaurant }) => {
  const router = useRouter();
  const { restaurant } = props;

  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurant.id });
  const favorites = api.favorite.getNumberOfFavorites.useQuery({
    restaurantId: restaurant.id,
  });
  const isFavoritedByMe = api.favorite.isRestaurantFavorited.useQuery({
    restaurantId: restaurant.id,
  });
  const createFavorite = api.favorite.createFavorite.useMutation();
  const deleteFavorite = api.favorite.delete.useMutation();

  const handleFavorite = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    createFavorite.mutate(
      { placement: 1, restaurantId: restaurant.id },
      {
        async onSuccess() {
          await isFavoritedByMe.refetch();
          await favorites.refetch();
        },
      }
    );
  };
  const handleUnfavorite = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    deleteFavorite.mutate(
      { restaurantId: restaurant.id },
      {
        async onSuccess() {
          await isFavoritedByMe.refetch();
          await favorites.refetch();
        },
      }
    );
  };
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
            <h3 className="text-xl font-bold">{restaurant.name}</h3>
            <span>$$</span>
            <div className="flex items-center text-green-500">
              <div>{favorites.data}</div>
              <div className="-rotate-90">
                {isFavoritedByMe.data && (
                  <div onClick={handleUnfavorite}>
                    <ForwardIcon />
                  </div>
                )}
                {!isFavoritedByMe.data && (
                  <div onClick={handleFavorite}>
                    <ForwardOutlinedIcon />
                  </div>
                )}
              </div>
            </div>
            <div className="rotate-90 text-red-500">
              <ForwardOutlinedIcon />
            </div>
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
