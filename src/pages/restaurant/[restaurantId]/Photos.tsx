import { api } from "../../../utils/api";
import Image from "next/image";
interface IProps {
  restaurantId: string;
}
const Photos = (props: IProps) => {
  const { restaurantId } = props;

  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurantId });
  const deletePhoto = api.photo.delete.useMutation();
  const handleDelete = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    deletePhoto.mutate(
      { id: id },
      {
        onSuccess() {
          photos.refetch();
        },
      }
    );
  };
  return (
    <div>
      {photos.data?.map((photo) => {
        return (
          <div className="flex gap-4">
            <Image
              key={photo.id}
              src={photo.photoUrl}
              alt="menu"
              width={500}
              height={500}
            />
            <div>
              <button
                className="rounded-md bg-red-500 p-4 hover:bg-red-700"
                onClick={(e) => handleDelete(e, photo.id)}
              >
                delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Photos;
