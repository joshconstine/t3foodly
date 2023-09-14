import { api } from "../../utils/api";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";
import ForwardIcon from "@mui/icons-material/Forward";
import { useRouter } from "next/router";
import { Tooltip } from "@mui/material";
interface IProps {
  restaurantId: string;
}
const UpVoteDownVote = (props: IProps) => {
  const { restaurantId } = props;
  const upVotes = api.upVote.getNumberOfUpVotes.useQuery({
    restaurantId: restaurantId,
  });
  const downVotes = api.downVote.getNumberOfDownVotes.useQuery({
    restaurantId: restaurantId,
  });
  const isUpVotedByMe = api.upVote.isRestaurantUpVoted.useQuery({
    restaurantId: restaurantId,
  });

  const isDownVotedByMe = api.downVote.isRestaurantDownVoted.useQuery({
    restaurantId: restaurantId,
  });
  const createDownVote = api.downVote.createDownVote.useMutation();
  const deleteDownVote = api.downVote.delete.useMutation();
  const createUpVote = api.upVote.createUpVote.useMutation();
  const deleteUpVote = api.upVote.delete.useMutation();
  const handleUpVote = (e?: React.SyntheticEvent<HTMLElement>) => {
    e?.preventDefault();
    createUpVote.mutate(
      { restaurantId: restaurantId },
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
      { restaurantId: restaurantId },
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
      { restaurantId: restaurantId },
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
      { restaurantId: restaurantId },
      {
        async onSuccess() {
          await isDownVotedByMe.refetch();
          await downVotes.refetch();
        },
      }
    );
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-green-500">
        <div className="-rotate-90">
          {isUpVotedByMe.data && (
            <div onClick={handleUnUpVote}>
              <ForwardIcon sx={{ height: "40px", width: "40px" }} />
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
        <span className="whitespace-nowrap">{upVotes.data} upvotes</span>
      </div>
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
        <span className="whitespace-nowrap">{downVotes.data} downvotes</span>
      </div>
    </div>
  );
};

export default UpVoteDownVote;
