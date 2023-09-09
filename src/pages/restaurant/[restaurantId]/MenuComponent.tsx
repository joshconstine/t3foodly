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
              className="btn-primary btn"
              onClick={() => setShowMenu(true)}
            >
              Menu
            </button>
          )}
          {showMenu && (
            <dialog
              open={showMenu}
              className="z-100 absolute top-16 flex flex-col items-center gap-4 rounded-lg border-2 bg-slate-200 p-4"
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
                className="btn-secondary btn-outline btn"
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
