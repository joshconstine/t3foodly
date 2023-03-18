import {
  RestaurantApplication,
  User,
  UsersRestaurantApplication,
} from "@prisma/client";
import Link from "next/link";
import React from "react";
import { api } from "../../utils/api";

import Image from "next/image";
const UsersRestaurantApplicationCard = (props: {
  application: UsersRestaurantApplication;
}) => {
  const { application } = props;

  const userName = api.user.getUsername.useQuery({
    id: application.created_by_user_id,
  });
  const photos = api.photo.getByApplicationId.useQuery({
    id: application.id,
  });
  const restaurant = api.restaurant.getById.useQuery({
    id: application.restaurant_id,
  });
  return (
    <div className=" overflow-hidden rounded-lg bg-white p-4 shadow-lg">
      {photos.data && photos.data.length > 0 && (
        <Image
          height={240}
          width={240}
          src={photos.data ? String(photos.data.at(0)?.photoUrl) : ""}
          alt="Restaurant Image"
        />
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{restaurant?.data?.name}</h3>
        <div>
          <h2 className="text-l ">
            Created: {application.created_at.toLocaleDateString()}
          </h2>
          <Link href={`/user/${application.created_by_user_id}`}>
            <h2 className="text-l ">Created by: {userName.data}</h2>
          </Link>
        </div>
      </div>
      <div className={`mt-4`}></div>
    </div>
  );
};

export default UsersRestaurantApplicationCard;
