import { api } from "../../utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { Comment } from "@prisma/client";
import Image from "next/image";
import { motion } from "framer-motion";
const CommentCard = (props: { comment: Comment }) => {
  const router = useRouter();
  const comment = props.comment;
  const restaurant = api.restaurant.getById.useQuery({
    id: comment?.restaurant_id,
  });
  const photos = api.photo.getByCommentId.useQuery({
    id: comment?.id,
  });
  const username = api.user.getUsername.useQuery({ id: comment?.user_id });
  return (
    <motion.div
      className="overflow-hidden rounded-lg  bg-white shadow-lg"
      whileHover={{ scale: 1.05 }}
    >
      {photos.data && photos.data.length > 0 && (
        <Image
          width={140}
          height={140}
          src={photos.data ? String(photos.data?.at(0)?.photoUrl) : ""}
          alt="Restaurant Image"
        />
      )}
      <div className="p-4">
        <Link href={`/restaurant/${restaurant.data?.id}`}>
          <h3 className="mb-2 text-xl font-bold hover:text-gray-700">
            {restaurant.data?.name}
          </h3>
        </Link>
        <p className="text-gray-700">
          {`${restaurant.data?.cityName}, ${restaurant.data?.stateName}`},
        </p>
        <p
          className="cursor-pointer font-bold text-gray-700 hover:text-gray-500"
          onClick={() => router.push(`/user/${comment?.user_id}`)}
        >
          {username.data || ""}
        </p>
        <p className="text-gray-700">{comment?.text}</p>
      </div>
    </motion.div>
  );
};

export default CommentCard;
