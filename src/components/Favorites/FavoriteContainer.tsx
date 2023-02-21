import { Reorder } from "framer-motion";
import { useState } from "react";
import Favorite from "./Favorite";

interface IFavoriteContainer {
  favoriteList: any;
  setFavoriteList: any;
}
const FavoriteContainer = (props: IFavoriteContainer) => {
  const { favoriteList, setFavoriteList } = props;
  const [isEditMode, setIsEditMode] = useState(false);
  return (
    <div className="w-full px-4 md:w-2/3">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="px-8 py-6">
          <h3 className="mb-2 text-xl font-bold">Favorites</h3>
          <button onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? "cancel" : "edit"}
          </button>
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
