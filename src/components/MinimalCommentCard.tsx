import { useRouter } from "next/router";
import React from "react";
import { api } from "../utils/api";

import Image from "next/image";
import { IconButton, Tooltip } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Comment } from "@prisma/client";
const MinimalCommentCard = (props: {
  comment: Comment | undefined;
  viewOnly?: boolean;
}) => {
  const router = useRouter();
  if (!props.comment || props.comment === undefined) return null;
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
    createReportedPhoto.mutate(
      {
        photoId: id,
        commentId: comment.id,
      },
      {
        onSuccess() {
          showToastFor3Seconds();
        },
      }
    );
  };
  const [showToast, setShowToast] = React.useState(false);
  const showToastFor3Seconds = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div
      className=" bg-z in w-full overflow-hidden rounded-lg border-2
        border-zinc-400 p-2"
    >
      <div className="flex gap-2 p-2">
        <div>
          <Image
            width={30}
            height={30}
            className="rounded-full"
            src={user.data?.image || ""}
            alt="Profile Image"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3
            className=" cursor-pointer font-bold"
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
      <div className="flex content-end items-end justify-between">
        {photos.data && photos.data.length > 0 && (
          <div className="indicator">
            <button
              onClick={() => handleReport(photos?.data?.at(0)?.id || "")}
              className="badge badge-secondary  indicator-item"
            >
              report photo
            </button>
            <Image
              width={40}
              height={40}
              className="w-48"
              src={photos.data ? String(photos.data.at(0)?.photoUrl) : ""}
              alt="Restaurant Image"
            />
          </div>
        )}
        {isUsersComment && !props.viewOnly && (
          <Tooltip title="delete">
            <IconButton disabled={false} onClick={handleDeleteComment}>
              <DeleteOutlineOutlinedIcon className="text-4xl text-secondary" />
            </IconButton>
          </Tooltip>
        )}
        {showToast && (
          <div className="toast">
            <div className="alert alert-info">
              <span>Your report will be sent to Foodley Admin</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalCommentCard;
