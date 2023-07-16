import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import SavedSearchIcon from "@mui/icons-material/SavedSearch";
export interface IPriceData {
  price: number;
  order: {
    name: string;
    quantity: number;
  }[];
}
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import { api } from "../../utils/api";
interface IProps {
  restaurantId: string;
}

const FavoriteSaveSmall = (props: IProps) => {
  const { restaurantId } = props;

  const isFavorited = api.favorite.isRestaurantFavorited.useQuery({
    restaurantId: String(restaurantId),
  });
  const isSaved = api.savedRestaurant.isRestaurantSaved.useQuery({
    restaurantId: String(restaurantId),
  });

  const createFavorite = api.favorite.createFavorite.useMutation();
  const deleteFavorite = api.favorite.delete.useMutation();
  const numberOfFavorites = api.favorite.getNumberOfFavorites.useQuery({
    restaurantId: String(restaurantId),
  });
  const createSavedRestaurant =
    api.savedRestaurant.addSavedRestaurant.useMutation();

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

  return (
    <div className="flex  items-center ">
      <div className="flex flex-col items-center gap-2">
        {isFavorited.data && isFavorited.data ? (
          <div>
            <IconButton disabled={false} onClick={handleUnfavorite}>
              <StarIcon className="text-md" />
            </IconButton>
          </div>
        ) : (
          <div>
            <IconButton disabled={false} onClick={handleFavorite}>
              <StarBorderOutlinedIcon className="" />
            </IconButton>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        {isSaved.data && isSaved.data ? (
          <div className="text-zinc-600">saved</div>
        ) : (
          <div>
            <IconButton disabled={false} onClick={handleSave}>
              <SaveAltIcon className=" " />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteSaveSmall;
