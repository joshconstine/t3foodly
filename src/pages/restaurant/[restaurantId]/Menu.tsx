import { api } from "../../../utils/api";
import Image from "next/image";
interface IProps {
  restaurantId: string;
}
const Menu = (props: IProps) => {
  const { restaurantId } = props;

  const menu = api.menu.getByRestaurantId.useQuery({ id: restaurantId });
  const deleteMenu = api.menu.delete.useMutation();
  const handleDelete = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    deleteMenu.mutate(
      { id: id },
      {
        onSuccess() {
          menu.refetch();
        },
      }
    );
  };
  return (
    <div>
      {menu.data?.map((menuPhoto) => {
        return (
          <div className="flex gap-4">
            <Image
              key={menuPhoto.id}
              src={menuPhoto.photoUrl}
              alt="menu"
              width={500}
              height={500}
            />
            <button
              className="rounded-md bg-red-500 p-4 hover:bg-red-700"
              onClick={(e) => handleDelete(e, menuPhoto.id)}
            >
              delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;