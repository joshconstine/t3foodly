import { api } from "../../utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { Comment } from "@prisma/client";
import Image from "next/image";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
const CommentCard = (props: { comment: Comment }) => {
  const router = useRouter();
  const comment = props.comment;
  const restaurant = api.restaurant.getById.useQuery({
    id: comment?.restaurant_id,
  });
  const photos = api.photo.getByCommentId.useQuery({
    id: comment?.id,
  });
  const user = api.user.getBasicUserInfoById.useQuery({ id: comment?.user_id });
  const createReportedPhoto =
    api.reportedPhoto.createReportedPhoto.useMutation();
  const handleReport = (id: string) => {
    createReportedPhoto.mutate({
      photoId: id,
      commentId: comment.id,
    });
  };
  return (
    <motion.div
      className=" flex w-64 flex-col gap-2 overflow-hidden rounded-lg border-2  bg-white px-2 pt-2"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex justify-around">
        <div className="rounded-lg border-2 p-2">
          <Tooltip title={user.data?.username || ""}>
            <Image
              width={30}
              height={30}
              className="rounded-full"
              src={user.data?.image || ""}
              alt="img"
            />
          </Tooltip>
        </div>

        <div>
          <Link href={`/restaurant/${restaurant.data?.id}`}>
            <h3 className="font-bold hover:text-gray-700">
              {restaurant.data?.name}
            </h3>
          </Link>
          <div className="flex flex-col gap-2 px-2">
            <p className="text-xs text-gray-700 ">
              {`${restaurant.data?.cityName}, ${restaurant.data?.stateName}`},
            </p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-700">{comment?.text}</p>
      </div>
      {photos.data && photos.data.length > 0 && (
        <div className="flex p-2 pt-2">
          <Image
            width={140}
            height={140}
            src={photos.data ? String(photos.data?.at(0)?.photoUrl) : ""}
            alt="Restaurant Image"
          />
          <button onClick={() => handleReport(photos?.data?.at(0)?.id || "")}>
            report
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CommentCard;
