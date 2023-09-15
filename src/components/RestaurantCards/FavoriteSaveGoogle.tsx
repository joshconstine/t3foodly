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
  placeId: string;
}

const FavoriteSaveGoogle = (props: IProps) => {
  const { placeId } = props;

  const createFavorite = api.favorite.createFavorite.useMutation();
  const deleteFavorite = api.favorite.delete.useMutation();
  // const numberOfFavorites
  const createSavedRestaurant =
    api.savedRestaurant.addSavedRestaurant.useMutation();
  // const handleFavorite = (e: React.SyntheticEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   createFavorite.mutate(
  //     { restaurantId: String(restaurantId) },
  //     {
  //       async onSuccess() {
  //         await isFavorited.refetch();
  //         await numberOfFavorites.refetch();
  //       },
  //     }
  //   );
  // };
  // const handleUnfavorite = (e: React.SyntheticEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   deleteFavorite.mutate(
  //     { restaurantId: String(restaurantId) },
  //     {
  //       async onSuccess() {
  //         await isFavorited.refetch();
  //         await numberOfFavorites.refetch();
  //       },
  //     }
  //   );
  // };

  // const handleSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   createSavedRestaurant.mutate(
  //     { restaurantId: String(restaurantId) },
  //     {
  //       async onSuccess() {
  //         await isSaved.refetch();
  //       },
  //     }
  //   );
  // };

  return (
    <div className="flex  items-center ">
      <div className="flex flex-col items-center gap-2">
        {false && false ? (
          <div>
            <IconButton
              disabled={false}
              onClick={() => {
                // handleUnfavorite()
              }}
            >
              <StarIcon className="text-md" />
            </IconButton>
          </div>
        ) : (
          <div>
            <IconButton
              disabled={false}
              onClick={() => {
                // handleFavorite()
              }}
            >
              <StarBorderOutlinedIcon className="" />
            </IconButton>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        {false && false ? (
          <div className="text-zinc-600">saved</div>
        ) : (
          <div>
            <IconButton
              disabled={false}
              onClick={() => {
                // handleSave()
              }}
            >
              <SaveAltIcon className=" " />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteSaveGoogle;
