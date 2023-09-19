import React from "react";
import Stars from "../../../../components/RestaurantCards/Stars";
import { Review } from "../../../../server/api/routers/restaurant";

import Image from "next/image";
type Props = {
  review: Review;
};

function GoogleReviewCard({ review }: Props) {
  if (!review) return null;
  return (
    <div className="md:text-md flex w-full flex-col gap-2 rounded-lg border-2 border-secondary p-4 text-xs md:w-96">
      <div>
        <div className="flex flex-col gap-1 md:flex-row md:gap-4">
          <Image
            width={40}
            height={40}
            src={review?.profile_photo_url || "lsl"}
            alt="img"
          />
          <div>
            <b>{review?.author_name}</b>
            <Stars numStars={review?.rating} />
          </div>
          <div>{review?.relative_time_description}</div>
        </div>
      </div>

      <div>{review?.text}</div>
    </div>
  );
}

export default GoogleReviewCard;
