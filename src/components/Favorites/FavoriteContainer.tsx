import { Reorder } from "framer-motion";
import { useState } from "react";
import { api } from "../../utils/api";
import Favorite from "./Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
interface IFavoriteContainer {
  favoriteList: any;
  setFavoriteList: any;
}
const FavoriteContainer = (props: IFavoriteContainer) => {
  const { favoriteList, setFavoriteList } = props;
  const [isEditMode, setIsEditMode] = useState(false);
  const updateFavorite = api.favorite.updateFavorite.useMutation();
  const handleSave = () => {
    setIsEditMode(false);
    const newList = favoriteList.map((elem: any, index: number) => {
      return { ...elem, placement: index + 1 };
    });

    newList.forEach((elem: any) => {
      updateFavorite.mutate({
        restaurantId: elem.restaurant_id,
        placement: elem.placement,
      });
    });
  };
  return (
    <div className="w-full  md:w-2/3">
      <div className="w-full overflow-hidden ">
        <div className=" flex flex-col gap-4 py-6">
          <div className="content-beteween flex items-center gap-2">
            <h3 className=" text-l font-bold">Your top 5</h3>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-md"
            >
              {isEditMode ? (
                <CancelIcon className="text-md text-zinc-500" />
              ) : (
                <EditOutlinedIcon className="text-md text-zinc-500" />
              )}
            </button>
            {isEditMode && (
              <button
                className="rounded-full bg-green-500 py-2 px-4 font-bold text-white"
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </div>
          {isEditMode && (
            <Reorder.Group
              axis="y"
              values={favoriteList}
              onReorder={setFavoriteList}
            >
              <div className="flex flex-col gap-2">
                {favoriteList?.map((elem: any, i) => {
                  return (
                    <Reorder.Item value={elem} key={elem.id}>
                      <Favorite restaurantId={elem.restaurant_id} />
                    </Reorder.Item>
                  );
                })}
              </div>
            </Reorder.Group>
          )}{" "}
          {!isEditMode && (
            <div className="flex flex-col gap-2">
              {favoriteList?.slice(0, 5).map((elem: any) => {
                return <Favorite restaurantId={elem.restaurant_id} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteContainer;
