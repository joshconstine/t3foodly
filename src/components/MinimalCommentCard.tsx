import { useRouter } from "next/router";
import React from "react";
import { api } from "../utils/api";

import Image from "next/image";
import { IconButton, Tooltip } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
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
  const createReportedPhoto =
    api.reportedPhoto.createReportedPhoto.useMutation();
  const handleReport = (id: string) => {
    createReportedPhoto.mutate({
      photoId: id,
      commentId: comment.id,
    });
  };
  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
      {photos.data && photos.data.length > 0 && (
        <>
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
        </>
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
