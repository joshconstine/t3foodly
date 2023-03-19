import { api } from "../../../utils/api";
import Image from "next/image";
interface IProps {
  restaurantId: string;
}
const Menu = (props: IProps) => {
  const { restaurantId } = props;

  const menu = api.menu.getByRestaurantId.useQuery({ id: restaurantId });

  return (
    <div>
      {menu.data?.map((menuPhoto) => {
        return (
          <Image
            key={menuPhoto.id}
            src={menuPhoto.photoUrl}
            alt="menu"
            width={500}
            height={500}
          />
        );
      })}
    </div>
  );
};

export default Menu;
