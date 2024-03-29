import Head from "next/head";

import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import MinimalCommentCard from "../../../components/MinimalCommentCard";
import Image from "next/image";

export interface IPriceData {
  price: number;
  order: {
    name: string;
    quantity: number;
  }[];
}
import FavoriteSaveActions from "./FavoriteSaveActions";
import CreateCommentContainer from "./CreateCommentContainer";
import EditRestaurantCard from "./EditRestaurantCard";
import MenuComponent from "./MenuComponent";
import { useState } from "react";
import ChatRoom from "./Chatroom";
import Skeleton from "@mui/material/Skeleton";
const SingleRestaurant = () => {
  const router = useRouter();
  const [showEditCard, setShowEditCard] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const { restaurantId } = router.query;

  const restaurant = api.restaurant.getById.useQuery({
    id: String(restaurantId),
  });
  const comments = api.comment.getByRestaurantId.useQuery({
    id: String(restaurantId),
  });

  const photos = api.photo.getByRestaurantId.useQuery({
    id: String(restaurantId),
  });

  const numberOfFavorites = api.favorite.getNumberOfFavorites.useQuery({
    restaurantId: String(restaurantId),
  });

  const createReportedPhoto =
    api.reportedPhoto.createReportedPhoto.useMutation();

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };
  const handleReportPhoto = (photo: any) => {
    createReportedPhoto.mutate({
      photoId: photo.id,
      restaurantId: String(restaurantId),
    });
  };
  if (restaurant.isLoading) {
    return (
      <section className=" mx-auto md:py-2">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 sm:px-6  lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <div className=" w-32">
                <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
              </div>
              <div className="w-8">
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </div>
              <div className="w-16">
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </div>

              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            </div>
            <div className="flex content-center items-center gap-8">
              <div className=" flex  flex-col items-center gap-2">
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              <div className=" flex  flex-col items-center gap-2">
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              <div className=" flex  flex-col items-center gap-2">
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              <div className=" flex flex-col items-center gap-2">
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
            </div>
          </div>
          <div>
            <Skeleton variant="rectangular" width={1056} height={704} />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <>
        <Head>
          <title>Foodley</title>
          <meta
            name={`${restaurant.data?.cityName} restaurants ${restaurant.data?.name}`}
            content={`${restaurant.data?.cityName} restaurants ${restaurant.data?.name}`}
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <section className=" mx-auto md:py-2">
            <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 sm:px-6  lg:px-8">
              <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between">
                <div className="flex flex-col p-2">
                  <h2 className="text-xl font-bold">{restaurant.data?.name}</h2>
                  <div>
                    <span>Favorties:</span>
                    <span className="countdown ">
                      <span
                        //@ts-ignore
                        style={{ "--value": numberOfFavorites?.data }}
                      ></span>
                    </span>
                  </div>
                  <span className=" text-xs text-primary ">
                    Address:
                    {`${restaurant?.data?.address}, ${restaurant?.data?.cityName}, ${restaurant?.data?.stateName}`}
                  </span>
                  <div className=" text-xs text-primary">
                    <a
                      href={`${restaurant.data?.website}` || ""}
                      target="_blank"
                    >
                      {restaurant?.data?.website}
                    </a>
                  </div>
                  <div className=" flex flex-wrap gap-1 text-xs text-primary">
                    {restaurant.data?.cuisines.map((elem) => {
                      return (
                        <div>
                          <div className="rounded-lg border-2 p-2">
                            {elem.cuisine.name}
                          </div>
                        </div>
                      );
                    })}{" "}
                    <div className="px-4">
                      <MenuComponent restaurantId={String(restaurantId)} />
                    </div>
                  </div>
                </div>
                <div>
                  <FavoriteSaveActions
                    setShowEditCard={setShowEditCard}
                    restaurantId={String(restaurantId) || ""}
                  />{" "}
                </div>
              </div>

              <div>
                <div>
                  <button
                    onClick={() =>
                      handleReportPhoto(photos?.data?.at(selectedPhotoIndex))
                    }
                    className="badge badge-secondary"
                  >
                    report photo
                  </button>
                  <div className="max-w-3xl">
                    <Image
                      src={photos.data?.at(selectedPhotoIndex)?.photoUrl || ""}
                      alt={restaurant.data?.name || ""}
                      width={1920}
                      height={1280}
                      layout="responsive"
                    />
                  </div>
                </div>
                <div className=" bg-gray-900  p-2 text-sm text-white">
                  <div className="flex space-x-2">
                    {photos.data?.map((photo, index) => (
                      <>
                        <button
                          key={photo.photoUrl}
                          className={`h-4 w-4 rounded-full ${
                            index === selectedPhotoIndex
                              ? "bg-white"
                              : "bg-gray-500"
                          }`}
                          onClick={() => handlePhotoClick(index)}
                        />
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-8 ">
                <div className=" flex flex-col gap-2 px-4">
                  <h3 className="text-lg font-bold">Reviews</h3>
                  {comments.isLoading && <div>Loading...</div>}
                  {comments.data?.length === 0 && (
                    <div
                      className="
                  text-primary md:text-3xl
                  "
                    >
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                  {comments.data?.map((comment) => (
                    <MinimalCommentCard comment={comment} />
                  ))}
                </div>
                <CreateCommentContainer
                  restaurantId={String(restaurantId) || ""}
                />
              </div>

              {showEditCard && (
                <EditRestaurantCard
                  setEditMode={setShowEditCard}
                  restaurantId={String(restaurantId) || ""}
                />
              )}
            </div>
          </section>
        </Layout>
      </>
    );
  }
};

export default SingleRestaurant;
