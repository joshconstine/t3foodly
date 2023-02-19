import { Reorder } from "framer-motion";
import Favorite from "./Favorite";

interface IFavoriteContainer {
  favoriteList: any;
  setFavoriteList: any;
}
const FavoriteContainer = (props: IFavoriteContainer) => {
  const { favoriteList, setFavoriteList } = props;
  return (
    <div className="w-full px-4 md:w-2/3">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-4">
          <h3 className="mb-2 text-xl font-bold">Favorites</h3>
          <Reorder.Group
            axis="y"
            values={favoriteList}
            onReorder={setFavoriteList}
          >
            {favoriteList?.map((elem: any) => {
              return (
                <Reorder.Item value={elem} key={elem.id}>
                  <Favorite restaurantId={elem.restaurant_id} />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
};

export default FavoriteContainer;
