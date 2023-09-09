import { useState } from "react";

import Image from "next/image";
import { api } from "../../../utils/api";
interface IProps {
  restaurantId: string;
}
const MenuComponent = (props: IProps) => {
  const { restaurantId } = props;
  const [showMenu, setShowMenu] = useState(false);
  const menu = api.menu.getByRestaurantId.useQuery({
    id: restaurantId,
  });
  return (
    <div>
      {menu.data && menu.data?.length > 0 && (
        <div>
          {!showMenu && (
            <button
              className="rounded-full bg-primary py-2 px-4 font-bold text-white "
              onClick={() => setShowMenu(true)}
            >
              Menu
            </button>
          )}
          {showMenu && (
            <dialog
              open={showMenu}
              className="z-100 absolute top-2 rounded-lg border-2 p-4"
            >
              <div>
                {menu?.data?.map((menuPhoto) => {
                  return (
                    <Image
                      key={menuPhoto.id}
                      src={menuPhoto.photoUrl}
                      alt="menu"
                      width={800}
                      height={1000}
                    />
                  );
                })}
              </div>
              <button
                className="rounded-full bg-yellow-500 py-2 px-4 font-bold text-white hover:bg-yellow-700"
                onClick={() => setShowMenu(false)}
              >
                close
              </button>
            </dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuComponent;
