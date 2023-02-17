import { useRouter } from "next/router";
import React from "react";
import { api } from "../utils/api";

import Image from "next/image";
const MinimalCommentCard = (props: { comment: any }) => {
  const router = useRouter();
  const comment = props.comment;
  const user = api.user.getUser.useQuery();
  const photos = api.photo.getByCommentId.useQuery({
    id: comment.id,
  });
  const isUsersComment = user.data?.id === comment.user_id;

  const username = api.user.getUsername.useQuery({ id: comment.user_id });
  const comments = api.comment.getByRestaurantId.useQuery({
    id: String(comment.restaurant_id),
  });

  const deleteComment = api.comment.delete.useMutation();
  const handleDeleteComment = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    deleteComment.mutate(
      {
        id: comment.id,
      },
      {
        onSuccess() {
          comments.refetch();
        },
      }
    );
  };
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      {photos.data && photos.data.length > 0 && (
        <Image
          width={40}
          height={40}
          className="w-48"
          src={photos.data ? String(photos.data.at(0)?.photoUrl) : ""}
          alt="Restaurant Image"
        />
      )}
      <div className="p-4">
        <h3
          className="mb-2 cursor-pointer text-xl font-bold"
          onClick={() => router.push(`/user/${comment.user_id}`)}
        >
          {username.data || ""}
        </h3>

        <p className="text-gray-700">{comment.text}</p>
      </div>
      {isUsersComment && (
        <button
          className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
          onClick={handleDeleteComment}
        >
          delete
        </button>
      )}
    </div>
  );
};

export default MinimalCommentCard;
