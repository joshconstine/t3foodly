import React from "react";

import Image from "next/image";
type Props = { numStars: number };
function Stars({ numStars }: Props) {
  return (
    <div>
      <div className="flex gap-1">
        {[...Array(Math.floor(numStars))].map((e, i) => {
          return (
            <Image
              width={20}
              height={20}
              src="/static/photos/star.png"
              alt="star"
            />
          );
        })}
      </div>
    </div>
  );
}

export default Stars;
