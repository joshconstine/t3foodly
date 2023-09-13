import { Skeleton } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../../../components/Layout";
import Stars from "../../../../components/RestaurantCards/Stars";
import UpVoteDownVote from "../../../../components/RestaurantCards/UpVoteDownVote";
import { api } from "../../../../utils/api";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
const SingleRestaurant = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const restaurant = api.restaurant.getByPlaceId.useQuery({
    placeId: String(restaurantId),
  });
  console.log(restaurant.data);

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  if (restaurant.isLoading) {
    return (
      <section className=" mx-auto md:py-2">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 sm:px-6  lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <div className=" w-32">
                <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
              </div>
              <div className="w-8">
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </div>
              <div className="w-16">
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </div>

              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            </div>
            <div className="flex content-center items-center gap-8">
              <div className=" flex  flex-col items-center gap-2">
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              <div className=" flex  flex-col items-center gap-2">
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              <div className=" flex  flex-col items-center gap-2">
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              <div className=" flex flex-col items-center gap-2">
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
            </div>
          </div>
          <div>
            <Skeleton variant="rectangular" width={1056} height={704} />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <>
        <Head>
          <title>Foodley</title>
          <meta name={`restaurants `} content={` restaus`} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <section className=" mx-auto md:py-2">
            <div className=" mx-auto flex w-full max-w-3xl  justify-between px-4  lg:px-8">
              <div>
                <div className="flex flex-col gap-16">
                  <button
                    className="btn-small btn-primary btn-outline btn w-64 "
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Back to results
                  </button>
                  <div className="flex items-center gap-8">
                    <div className="rounded-full border-2 border-gray-400 p-8"></div>
                    <div className="flex flex-col gap-4">
                      <div className=" flex gap-16">
                        <h1 className="text-2xl font-bold">
                          {restaurant.data?.name}
                        </h1>
                        <UpVoteDownVote restaurantId={restaurantId} />
                      </div>
                      <Stars numStars={restaurant.data?.rating || 0} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-8">
                <div className="flex flex-col items-center gap-2">
                  <span>Add to your favorites</span>
                  <button className="btn-secondary btn-outline btn  rounded-full">
                    <FavoriteBorderOutlinedIcon />
                  </button>
                  <button className="btn-rounded btn-secondary btn-sm btn w-32 rounded-full">
                    Menu
                  </button>{" "}
                  <button className="btn-rounded btn-secondary btn-sm btn w-32 whitespace-nowrap rounded-full">
                    Leave a review
                  </button>
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
    );
  }
};

export default SingleRestaurant;
