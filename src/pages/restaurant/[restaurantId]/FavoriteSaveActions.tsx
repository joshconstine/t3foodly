import { api } from "../../../utils/api";

import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import ReviewsIcon from "@mui/icons-material/Reviews";
export interface IPriceData {
  price: number;
  order: {
    name: string;
    quantity: number;
  }[];
}
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useSession } from "next-auth/react";
import { useState } from "react";
interface IProps {
  restaurantId: string;
}

const FavoriteSaveActions = (props: IProps) => {
  const { restaurantId } = props;
  const session = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const isFavorited = api.favorite.isRestaurantFavorited.useQuery({
    restaurantId: String(restaurantId),
  });
  const isSaved = api.savedRestaurant.isRestaurantSaved.useQuery({
    restaurantId: String(restaurantId),
  });
  const isMyRestaurant = api.usersRestaurant.isRestaurantAUsers.useQuery({
    restaurantId: String(restaurantId),
  });
  const createFavorite = api.favorite.createFavorite.useMutation();
  const deleteFavorite = api.favorite.delete.useMutation();
  const numberOfFavorites = api.favorite.getNumberOfFavorites.useQuery({
    restaurantId: String(restaurantId),
  });
  const createSavedRestaurant =
    api.savedRestaurant.addSavedRestaurant.useMutation();
  const createUsersRestaurantApplication =
    api.usersRestaurantApplication.createUsersRestaurantApplication.useMutation();
  const deleteSavedRestaurant = api.savedRestaurant.delete.useMutation();
  const handleFavorite = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createFavorite.mutate(
      { restaurantId: String(restaurantId) },
      {
        async onSuccess() {
          await isFavorited.refetch();
          await numberOfFavorites.refetch();
        },
      }
    );
  };
  const handleUnfavorite = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteFavorite.mutate(
      { restaurantId: String(restaurantId) },
      {
        async onSuccess() {
          await isFavorited.refetch();
          await numberOfFavorites.refetch();
        },
      }
    );
  };

  const handleSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createSavedRestaurant.mutate(
      { restaurantId: String(restaurantId) },
      {
        async onSuccess() {
          await isSaved.refetch();
        },
      }
    );
  };
  const handleUnSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteSavedRestaurant.mutate(
      { restaurantId: String(restaurantId) },
      {
        async onSuccess() {
          await isSaved.refetch();
        },
      }
    );
  };
  const handleAddRestaurantToUser = (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    createUsersRestaurantApplication.mutate(
      {
        restaurantId: String(restaurantId),
      },
      {
        async onSuccess() {
          await isMyRestaurant.refetch();
          setShowDialog(true);
        },
      }
    );
  };
  return (
    <div className="flex w-full justify-center gap-8 border-t-2 border-zinc-500">
      <div className="flex flex-col items-center gap-2">
        <div> Favorite</div>
        {isFavorited.data && isFavorited.data ? (
          <Tooltip title="Unfavorite">
            <IconButton disabled={false} onClick={handleUnfavorite}>
              <StarIcon className="text-secondary md:text-4xl" />
            </IconButton>
          </Tooltip>
        ) : (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip title="Favorite">
              <IconButton disabled={false} onClick={handleFavorite}>
                <StarBorderOutlinedIcon className="text-secondary md:text-4xl" />
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div>Review</div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Tooltip title="save">
            <IconButton
              disabled={false}
              onClick={() => {
                window.scrollTo(0, document.body.scrollHeight);
              }}
            >
              <ReviewsIcon className="text-secondary md:text-4xl" />
            </IconButton>
          </Tooltip>
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div> Save</div>
        {isSaved.data && isSaved.data ? (
          <div>
            <button
              disabled={false}
              onClick={handleUnSave}
              className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
            >
              Un-Save
            </button>
          </div>
        ) : (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip title="save">
              <IconButton disabled={false} onClick={handleSave}>
                <SaveAltIcon className="text-secondary md:text-4xl" />
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <button
          disabled={false}
          onClick={handleAddRestaurantToUser}
          className=" rounded-md border-2 border-secondary px-2 py-2 text-secondary"
        >
          Apply
        </button>
        <div className="w-32">Apply to be restaurant admin</div>
      </div>
      <dialog
        open={showDialog}
        className="bg fixed inset-0 z-10 w-2/3 overflow-y-auto rounded-lg border-2 border-zinc-700 bg-gray-400"
      >
        <div className="flex flex-col items-center gap-2">
          <div>
            Your Request will be reviewed by an admin and you will be notified
            of the decision
          </div>
          <button
            onClick={() => setShowDialog(false)}
            formMethod="dialog"
            className="rounded-md bg-red-500  p-1 text-white hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default FavoriteSaveActions;
