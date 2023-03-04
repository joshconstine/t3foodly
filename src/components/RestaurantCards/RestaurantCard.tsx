import { Restaurant } from "@prisma/client";
import React from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";
import ForwardIcon from "@mui/icons-material/Forward";
import { useRouter } from "next/router";
import { Tooltip } from "@mui/material";
const RestaurantCard = (props: { restaurant: Restaurant }) => {
  const router = useRouter();
  const { restaurant } = props;

  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurant.id });
  const upVotes = api.upVote.getNumberOfUpVotes.useQuery({
    restaurantId: restaurant.id,
  });
  const downVotes = api.downVote.getNumberOfDownVotes.useQuery({
    restaurantId: restaurant.id,
  });
  const isUpVotedByMe = api.upVote.isRestaurantUpVoted.useQuery({
    restaurantId: restaurant.id,
  });

  const isDownVotedByMe = api.downVote.isRestaurantDownVoted.useQuery({
    restaurantId: restaurant.id,
  });
  const createDownVote = api.downVote.createDownVote.useMutation();
  const deleteDownVote = api.downVote.delete.useMutation();
  const createUpVote = api.upVote.createUpVote.useMutation();
  const deleteUpVote = api.upVote.delete.useMutation();

  const handleUpVote = (e?: React.SyntheticEvent<HTMLElement>) => {
    e?.preventDefault();
    createUpVote.mutate(
      { restaurantId: restaurant.id },
      {
        async onSuccess() {
          if (isDownVotedByMe.data) {
            handleUnDownVote();
          }
          await isUpVotedByMe.refetch();
          await upVotes.refetch();
        },
      }
    );
  };
  const handleUnUpVote = (e?: React.SyntheticEvent<HTMLElement>) => {
    e?.preventDefault();
    deleteUpVote.mutate(
      { restaurantId: restaurant.id },
      {
        async onSuccess() {
          await isUpVotedByMe.refetch();
          await upVotes.refetch();
        },
      }
    );
  };
  const handleDownVote = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    createDownVote.mutate(
      { restaurantId: restaurant.id },
      {
        async onSuccess() {
          if (isUpVotedByMe.data) {
            handleUnUpVote();
          }
          await isDownVotedByMe.refetch();
          await downVotes.refetch();
        },
      }
    );
  };
  const handleUnDownVote = (e?: React.SyntheticEvent<HTMLElement>) => {
    e?.preventDefault();
    deleteDownVote.mutate(
      { restaurantId: restaurant.id },
      {
        async onSuccess() {
          await isDownVotedByMe.refetch();
          await downVotes.refetch();
        },
      }
    );
  };
  return (
    <div className=" h-64">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <Image
          width={220}
          height={220}
          src={photos.data?.at(0)?.photoUrl || "/static/photos/yum.png"}
          alt="Yum"
          className="relative rounded-lg"
          z-index={0}
        />
        <div>
          <div className="flex gap-2">
            <h3 className="text-xl font-bold">{restaurant.name}</h3>
            <span>$$</span>
            <div className="flex items-center text-green-500">
              <div>{upVotes.data}</div>
              <div className="-rotate-90">
                {isUpVotedByMe.data && (
                  <div onClick={handleUnUpVote}>
                    <ForwardIcon />
                  </div>
                )}
                {!isUpVotedByMe.data && (
                  <div onClick={handleUpVote}>
                    <Tooltip title="Upvote">
                      <ForwardOutlinedIcon />
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>{" "}
            <div className="flex items-center text-red-500">
              <div className="rotate-90">
                {isDownVotedByMe.data && (
                  <div onClick={handleUnDownVote}>
                    <ForwardIcon />
                  </div>
                )}
                {!isDownVotedByMe.data && (
                  <div onClick={handleDownVote}>
                    <Tooltip title="Downvote">
                      <ForwardOutlinedIcon />
                    </Tooltip>
                  </div>
                )}
              </div>
              <div>{downVotes.data}</div>
            </div>
          </div>
          <div className={`$ mt-4`}>
            <button
              className="rounded-full bg-primary py-2 px-4 font-bold text-white"
              onClick={() => router.push(`restaurant/${restaurant.id}`)}
            >
              details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
