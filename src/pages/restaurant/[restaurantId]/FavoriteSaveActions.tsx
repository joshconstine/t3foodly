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
import { signIn, useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/router";
interface IProps {
  restaurantId: string;
  setShowEditCard: React.Dispatch<React.SetStateAction<boolean>>;
}

const FavoriteSaveActions = (props: IProps) => {
  const { restaurantId, setShowEditCard } = props;
  const Router = useRouter();
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
    if (!session.data) {
      signIn();
      return;
    }
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
    if (!session.data) {
      signIn();
      return;
    }
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
    if (!session.data) {
      signIn();
      return;
    }
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
    <div className="flex w-full justify-center gap-8 border-zinc-500">
      <div className="flex flex-col items-center gap-2">
        <div> Favorite</div>
        {isFavorited.data && isFavorited.data ? (
          <IconButton disabled={false} onClick={handleUnfavorite}>
            <StarIcon className="text-secondary " />
          </IconButton>
        ) : (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton disabled={false} onClick={handleFavorite}>
              <StarBorderOutlinedIcon className="text-secondary" />
            </IconButton>
          </motion.div>
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div>Review</div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton
            disabled={false}
            onClick={() => {
              window.scrollTo(0, document.body.scrollHeight);
              const commentInput = document.getElementById("addComment");
              commentInput?.focus();
            }}
          >
            <ReviewsIcon className="text-secondary " />
          </IconButton>
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-2">
        {isSaved.data && isSaved.data ? (
          <div className="flex h-full items-center justify-center">
            <button
              disabled={false}
              onClick={handleUnSave}
              className="whitespace-nowrap rounded-md border-2 border-secondary py-1 px-2 text-xs text-secondary "
            >
              Un-Save
            </button>
          </div>
        ) : (
          <>
            <div> Save</div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton disabled={false} onClick={handleSave}>
                <SaveAltIcon className="text-secondary " />
              </IconButton>
            </motion.div>
          </>
        )}
      </div>
      {!isMyRestaurant.data ? (
        <div>
          <div className="flex flex-col items-center gap-2 text-xs">
            <div className="w-32">Apply to be restaurant admin</div>
            <button
              disabled={false}
              onClick={handleAddRestaurantToUser}
              className="btn-secondary btn-outline btn"
            >
              Apply
            </button>
          </div>
          <dialog
            open={showDialog}
            className="bg fixed inset-0 z-10 w-2/3 overflow-y-auto rounded-lg border-2 border-zinc-700 bg-gray-400"
          >
            <div className="flex flex-col items-center gap-2">
              <div>
                Your Request will be reviewed by an admin and you will be
                notified of the decision
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
      ) : (
        <div className="mt-2 flex w-16 flex-col gap-2">
          <span className="text-xs">
            You are the manager of this restaurant
          </span>
          <button
            className="rounded-md  border-2 border-secondary py-1 px-2  text-secondary "
            onClick={() => {
              setShowEditCard(true);
            }}
          >
            edit
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoriteSaveActions;
