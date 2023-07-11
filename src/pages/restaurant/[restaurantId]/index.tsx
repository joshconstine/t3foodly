import Head from "next/head";

import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import MinimalCommentCard from "../../../components/MinimalCommentCard";
import Image from "next/image";

export interface IPriceData {
  price: number;
  order: {
    name: string;
    quantity: number;
  }[];
}
import UpVoteDownVote from "../../../components/RestaurantCards/UpVoteDownVote";
import FavoriteSaveActions from "./FavoriteSaveActions";
import CreateCommentContainer from "./CreateCommentContainer";
import EditRestaurantCard from "./EditRestaurantCard";
import MenuComponent from "./MenuComponent";
const SingleRestaurant = () => {
  const router = useRouter();
  // const [showEditCard, setShowEditCard] = useState(false);
  // const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  let selectedPhotoIndex = 0;
  const { restaurantId } = router.query;

  const restaurant = api.restaurant.getById.useQuery({
    id: String(restaurantId),
  });
  const comments = api.comment.getByRestaurantId.useQuery({
    id: String(restaurantId),
  });

  const photos = api.photo.getByRestaurantId.useQuery({
    id: String(restaurantId),
  });

  const numberOfFavorites = api.favorite.getNumberOfFavorites.useQuery({
    restaurantId: String(restaurantId),
  });
  const isMyRestaurant = api.usersRestaurant.isRestaurantAUsers.useQuery({
    restaurantId: String(restaurantId),
  });
  const createReportedPhoto =
    api.reportedPhoto.createReportedPhoto.useMutation();

  const handlePhotoClick = (index: number) => {
    selectedPhotoIndex = index;
  };
  const handleReportPhoto = (photo: any) => {
    createReportedPhoto.mutate({
      photoId: photo.id,
      restaurantId: String(restaurantId),
    });
  };
  return (
    <>
      <Head>
        <title>Foodley</title>
        <meta
          name={`${restaurant.data?.cityName} restaurants ${restaurant.data?.name}`}
          content={`${restaurant.data?.cityName} restaurants ${restaurant.data?.name}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mx-auto my-8 max-w-4xl px-4">
          <div className="flex flex-col space-y-8">
            <div className="relative h-96 w-full">
              <Image
                width={1920}
                height={1280}
                src={photos.data?.at(selectedPhotoIndex)?.photoUrl || ""}
                alt={restaurant.data?.name || ""}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-50 p-4 text-sm text-white">
                <div className="flex space-x-2">
                  {photos.data?.map((photo, index) => (
                    <>
                      <button
                        key={photo.photoUrl}
                        className={`h-4 w-4 rounded-full ${
                          index === selectedPhotoIndex
                            ? "bg-white"
                            : "bg-gray-500"
                        }`}
                        onClick={() => handlePhotoClick(index)}
                      />
                      <button onClick={() => handleReportPhoto(photo)}>
                        report photo
                      </button>
                    </>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <MenuComponent restaurantId={String(restaurantId)} />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{restaurant.data?.name}</h2>
              <div className="text-bold text-3xl text-primary">
                Favorties: {numberOfFavorites.data && numberOfFavorites.data}
              </div>
              {/* {isMyRestaurant.data && (
                <button
                  className="rounded-full bg-yellow-500 py-2 px-4 font-bold text-white hover:bg-yellow-700"
                  onClick={() => {
                    setShowEditCard(true);
                  }}
                >
                  edit
                </button>
              )} */}
            </div>
            <div className="flex gap-4">
              <FavoriteSaveActions restaurantId={String(restaurantId) || ""} />
              <UpVoteDownVote restaurantId={String(restaurantId) || ""} />
            </div>
            {/* {showEditCard && (
              <EditRestaurantCard
                setEditMode={setShowEditCard}
                restaurantId={String(restaurantId)}
              />
            )} */}
            <div className="flex flex-col-reverse gap-8 md:flex-row">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Reviews</h3>
                {comments.data?.map((comment) => (
                  <MinimalCommentCard comment={comment} />
                ))}
              </div>
              <CreateCommentContainer
                restaurantId={String(restaurantId) || ""}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SingleRestaurant;
