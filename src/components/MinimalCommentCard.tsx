import { useRouter } from "next/router";
import React from "react";
import { api } from "../utils/api";

import Image from "next/image";
import { IconButton, Tooltip } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Comment } from "@prisma/client";
const MinimalCommentCard = (props: { comment: Comment }) => {
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
  const createReportedPhoto =
    api.reportedPhoto.createReportedPhoto.useMutation();
  const handleReport = (id: string) => {
    createReportedPhoto.mutate({
      photoId: id,
      commentId: comment.id,
    });
  };
  return (
    <div
      className=" bg-z in w-full overflow-hidden rounded-lg border-2
        border-zinc-400 "
    >
      {photos.data && photos.data.length > 0 && (
        <div className="flex px-2 pt-2">
          <Image
            width={40}
            height={40}
            className="w-48"
            src={photos.data ? String(photos.data.at(0)?.photoUrl) : ""}
            alt="Restaurant Image"
          />
          <button onClick={() => handleReport(photos?.data?.at(0)?.id || "")}>
            report
          </button>
        </div>
      )}
      <div className="flex gap-2 p-4">
        <Image
          width={60}
          height={60}
          className="rounded-full"
          src={user.data?.image || ""}
          alt="Profile Image"
        />
        <div>
          <h3
            className=" cursor-pointer text-xl font-bold"
            onClick={() => router.push(`/user/${comment.user_id}`)}
          >
            {username.data || ""}
          </h3>
          <div
            className="cursor-pointer text-sm "
            onClick={() => router.push(`/user/${comment.user_id}`)}
          >
            {new Date(comment?.created_at).toLocaleDateString() || ""}
          </div>
        </div>
      </div>
      <div className="p-2">
        <p className="text-sm text-gray-700">{comment.text}</p>
      </div>
      {isUsersComment && (
        <Tooltip title="delete">
          <IconButton disabled={false} onClick={handleDeleteComment}>
            <DeleteOutlineOutlinedIcon className="text-4xl text-secondary" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default MinimalCommentCard;
