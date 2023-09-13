import { Skeleton } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../../../components/Layout";
import Stars from "../../../../components/RestaurantCards/Stars";
import UpVoteDownVote from "../../../../components/RestaurantCards/UpVoteDownVote";
import { api } from "../../../../utils/api";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
const returnDayofWeek = (day: number) => {
  switch (day) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tues";
    case 3:
      return "Wed";
    case 4:
      return "Thurs";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
  }
};
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
                <div className="flex flex-col gap-8">
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
                  <div>
                    <div className="items-canter flex gap-2">
                      <strong> Address:</strong>
                      <a>{restaurant.data?.formatted_address}</a>
                    </div>{" "}
                    <div className="items-canter flex gap-2">
                      <strong> Phone:</strong>
                      <a>{restaurant.data?.formatted_phone_number}</a>
                    </div>{" "}
                    {restaurant.data?.opening_hours?.open_now ? (
                      <div className="items-canter flex gap-2">
                        <strong className="text-green-500"> Open:</strong>
                      </div>
                    ) : (
                      <div className="items-canter flex gap-2">
                        <strong className="text-red-500"> Closed:</strong>
                      </div>
                    )}
                    <div>
                      <strong>more hours </strong>
                      {restaurant.data?.opening_hours?.periods && (
                        <div className="flex flex-col gap-2">
                          {restaurant.data?.opening_hours?.periods.map(
                            (period) => {
                              const openHours = period.open.time.substring(
                                0,
                                2
                              );
                              const openMinutes = period.open.time.substring(
                                2,
                                4
                              );

                              const closeHours = period.close.time.substring(
                                0,
                                2
                              );
                              const closeMinutes = period.close.time.substring(
                                2,
                                4
                              );

                              // Create a new Date object
                              const openTime = new Date();
                              const closeTime = new Date();
                              // Set the hours and minutes of the Date object
                              openTime.setHours(
                                Number(openHours),
                                Number(openMinutes)
                              );
                              closeTime.setHours(
                                Number(closeHours),
                                Number(closeMinutes)
                              );

                              // Format the date as "HH (AM/PM)"
                              const formattedOpenTime = openTime.toLocaleString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              );
                              const formattedCloseTime =
                                closeTime.toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                });

                              return (
                                <div className="flex w-64 gap-2">
                                  <div className="flex w-full justify-between">
                                    <div>
                                      <span>
                                        {returnDayofWeek(period.open.day)}
                                      </span>
                                    </div>
                                    <div>
                                      <span>{formattedOpenTime}</span>-
                                      <span>{formattedCloseTime}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span>Join the chat room</span>
                    <div className=" flex items-center gap-4 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">
                      <span className="whitespace-nowrap text-xs ">
                        Chat Room
                      </span>
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-4">
                      <span>Website</span>
                      <a
                        target={"_blank"}
                        className="underline"
                        href={restaurant.data?.website}
                      >
                        {restaurant.data?.website}
                      </a>
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