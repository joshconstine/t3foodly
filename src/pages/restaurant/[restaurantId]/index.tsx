"use-client";
import Head from "next/head";

import { api } from "../../../utils/api";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import MinimalCommentCard from "../../../components/MinimalCommentCard";
import Image from "next/image";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
export interface IPriceData {
  price: number;
  order: {
    name: string;
    quantity: number;
  }[];
}
import SaveAltIcon from "@mui/icons-material/SaveAlt";
const SingleRestaurant = () => {
  const router = useRouter();
  const [priceData, setPriceData] = useState<IPriceData | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [file, setFile] = useState<any>();
  const [preview, setPreview] = useState<undefined | string>();
  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  const { restaurantId } = router.query;

  const restaurant = api.restaurant.getById.useQuery({
    id: String(restaurantId),
  });
  const createComment = api.comment.createComment.useMutation();
  const comments = api.comment.getByRestaurantId.useQuery({
    id: String(restaurantId),
  });
  const createFavorite = api.favorite.createFavorite.useMutation();
  const deleteFavorite = api.favorite.delete.useMutation();

  const createSavedRestaurant =
    api.savedRestaurant.addSavedRestaurant.useMutation();
  const deleteSavedRestaurant = api.savedRestaurant.delete.useMutation();
  const photos = api.photo.getByRestaurantId.useQuery({
    id: String(restaurantId),
  });
  const isFavorited = api.favorite.isRestaurantFavorited.useQuery({
    restaurantId: String(restaurantId),
  });
  const isSaved = api.savedRestaurant.isRestaurantSaved.useQuery({
    restaurantId: String(restaurantId),
  });
  const createPhoto = api.photo.createPhoto.useMutation();
  const numberOfFavorites = api.favorite.getNumberOfFavorites.useQuery({
    restaurantId: String(restaurantId),
  });

  const storeFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const uploadedFile = input.files[0];
    setFile(uploadedFile);
  };
  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      comment: { value: string };
    };
    createComment.mutate(
      { text: formElements.comment.value, restaurantId: String(restaurantId) },
      {
        onSuccess(commentData) {
          const uploadPhoto = async () => {
            try {
              let { data } = await axios.post("/api/s3/upload-url", {
                name: file.name,
                type: file.type,
              });
              const url = data.url;

              let res = await axios.put(url, file, {
                headers: {
                  "Content-type": file.type,
                  "Access-Control-Allow-Origin": "*",
                },
              });
              setFile(null);
              if (res.status === 200) {
                createPhoto.mutate({
                  commentId: commentData.id,
                  photoUrl: `https://foodly-bucket.s3.us-west-1.amazonaws.com/${file.name}`,
                });
              } else {
                console.error("Upload failed.");
              }
            } catch (e) {
              console.log(e);
            }
          };
          uploadPhoto();
          comments.refetch();
        },
      }
    );
  };

  const handleFavorite = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createFavorite.mutate(
      { restaurantId: String(restaurantId) },
      {
        async onSuccess() {
          await isFavorited.refetch();
          await numberOfFavorites.refetch();
        },
      }
    );
  };
  const handleUnfavorite = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteFavorite.mutate(
      { restaurantId: String(restaurantId) },
      {
        async onSuccess() {
          await isFavorited.refetch();
          await numberOfFavorites.refetch();
        },
      }
    );
  };

  const handleSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createSavedRestaurant.mutate(
      { restaurantId: String(restaurantId) },
      {
        async onSuccess() {
          await isSaved.refetch();
        },
      }
    );
  };
  const handleUnSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteSavedRestaurant.mutate(
      { restaurantId: String(restaurantId) },
      {
        async onSuccess() {
          await isSaved.refetch();
        },
      }
    );
  };
  return (
    <>
      <Head>
        <title>Foodly</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mx-auto my-8 max-w-4xl px-4">
          <div className="flex flex-col space-y-8">
            <div className="relative h-96 w-full">
              <Image
                width={1920}
                height={1280}
                src={photos.data?.at(selectedPhotoIndex)?.photoUrl || ""}
                alt={restaurant.data?.name || ""}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-50 p-4 text-sm text-white">
                <div className="flex space-x-2">
                  {photos.data?.map((photo, index) => (
                    <button
                      key={photo.photoUrl}
                      className={`h-4 w-4 rounded-full ${
                        index === selectedPhotoIndex
                          ? "bg-white"
                          : "bg-gray-500"
                      }`}
                      onClick={() => handlePhotoClick(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{restaurant.data?.name}</h2>
              <div className="text-bold text-3xl text-primary">
                Favorties: {numberOfFavorites.data && numberOfFavorites.data}
              </div>
            </div>
            <div className="flex gap-4">
              {isFavorited.data && isFavorited.data ? (
                <Tooltip title="Unfavorite">
                  <IconButton disabled={false} onClick={handleUnfavorite}>
                    <StarIcon className="text-4xl text-secondary" />
                  </IconButton>
                </Tooltip>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Tooltip title="Favorite">
                    <IconButton disabled={false} onClick={handleFavorite}>
                      <StarBorderOutlinedIcon className="text-4xl text-secondary" />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              )}
              {isSaved.data && isSaved.data ? (
                <div>
                  <button
                    disabled={false}
                    onClick={handleUnSave}
                    className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
                  >
                    Un-Save
                  </button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Tooltip title="save">
                    <IconButton disabled={false} onClick={handleSave}>
                      <SaveAltIcon className="text-4xl text-secondary" />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Reviews</h3>
              {comments.data?.map((comment) => (
                <MinimalCommentCard comment={comment} />
              ))}
            </div>
            <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
              <h3 className="mb-4 text-lg font-bold">Leave a comment</h3>
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="mb-2 block font-bold text-gray-700"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  className="form-textarea  h-32 w-full rounded-md border-2 border-secondary shadow-sm "
                  required
                />
              </div>
              {file && (
                <Image
                  src={preview || ""}
                  alt={"photo"}
                  width={400}
                  height={200}
                />
              )}
              <div>
                <input type="file" onChange={(e) => storeFile(e)} />
              </div>
              <div>
                <button
                  type="submit"
                  className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>{" "}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SingleRestaurant;
