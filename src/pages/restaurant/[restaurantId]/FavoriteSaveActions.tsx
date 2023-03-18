import { api } from "../../../utils/api";

import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
export interface IPriceData {
  price: number;
  order: {
    name: string;
    quantity: number;
  }[];
}
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useSession } from "next-auth/react";
interface IProps {
  restaurantId: string;
}

const FavoriteSaveActions = (props: IProps) => {
  const { restaurantId } = props;
  const session = useSession();
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
        },
      }
    );
  };
  return (
    <div className="flex items-center gap-4">
      {isFavorited.data && isFavorited.data ? (
        <Tooltip title="Unfavorite">
          <IconButton disabled={false} onClick={handleUnfavorite}>
            <StarIcon className="text-4xl text-secondary" />
          </IconButton>
        </Tooltip>
      ) : (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Tooltip title="Favorite">
            <IconButton disabled={false} onClick={handleFavorite}>
              <StarBorderOutlinedIcon className="text-4xl text-secondary" />
            </IconButton>
          </Tooltip>
        </motion.div>
      )}
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
              <SaveAltIcon className="text-4xl text-secondary" />
            </IconButton>
          </Tooltip>
        </motion.div>
      )}
      <div>
        <button
          disabled={false}
          onClick={handleAddRestaurantToUser}
          className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
        >
          My restaurant
        </button>
      </div>
    </div>
  );
};

export default FavoriteSaveActions;
