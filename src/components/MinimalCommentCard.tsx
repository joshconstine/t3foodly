import { useSession } from "next-auth/react";
import { api } from "../utils/api";

const MinimalCommentCard = (props: { comment: any }) => {
  const comment = props.comment;

  const photos = api.photo.getByCommentId.useQuery({
    id: comment.id,
  });
  const username = api.user.getUsername.useQuery({ id: comment.user_id });
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      {photos.data && photos.data.length > 0 && (
        <img
          className="w-48"
          src={photos.data ? String(photos.data.at(0)?.photoUrl) : ""}
          alt="Restaurant Image"
        />
      )}
      <div className="p-4">
        <h3 className="mb-2 text-xl font-bold">{username.data}</h3>

        <p className="text-gray-700">{comment.text}</p>
      </div>
    </div>
  );
};

export default MinimalCommentCard;
