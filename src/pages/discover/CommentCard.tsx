import { prisma } from "@prisma/client";
import { api } from "../../utils/api";
import { Comment } from "../../server/api/routers/comment";

const CommentCard = (props: { comment: any }) => {
  const comment = props.comment;
  console.log("comment", comment);
  const restaurant = api.restaurant.getById.useQuery({
    id: comment.restaurant_id,
  });
  const photos = api.photo.getByRestaurantId.useQuery({
    id: comment.restaurant_id,
  });
  const username = api.user.getUsername.useQuery({ id: comment.user_id });

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      <img
        className="w-full"
        src={photos.data ? String(photos.data.at(0)?.photoUrl) : ""}
        alt="Restaurant Image"
      />
      <div className="p-4">
        <h3 className="mb-2 text-xl font-bold">{restaurant.data?.name}</h3>
        <p className="text-gray-700">
          {`${restaurant.data?.cityName}, ${restaurant.data?.stateName}`},
        </p>
        <p className="font-bold text-gray-700">{username.data}</p>
        <p className="text-gray-700">{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentCard;
