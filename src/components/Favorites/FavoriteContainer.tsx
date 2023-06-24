import { Reorder } from "framer-motion";
import { useState } from "react";
import { api } from "../../utils/api";
import Favorite from "./Favorite";

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
      <div className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="px-8 py-6">
          <h3 className="mb-2 text-xl font-bold">Favorites</h3>
          <button onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? "cancel" : "edit"}
          </button>
          {isEditMode && <button onClick={handleSave}>Save</button>}
          {isEditMode && (
            <Reorder.Group
              axis="y"
              values={favoriteList}
              onReorder={setFavoriteList}
            >
              <div className="flex flex-col gap-2">
                {favoriteList?.map((elem: any) => {
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
              {favoriteList?.map((elem: any) => {
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
