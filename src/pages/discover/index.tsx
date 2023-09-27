import { Skeleton } from "@mui/material";
import { height } from "@mui/system";
import { CheckIn } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Layout from "../../components/Layout";
import RestaurantCard from "../../components/RestaurantCards/RestaurantCard";
import { IGoogleRestaurantResult } from "../../server/api/routers/restaurant";
import { api } from "../../utils/api";
import { RestaurantCardSkeleton } from "../restaurant";
import CommentCard from "./CommentCard";

const RestaurantWithCheckIn = ({restaurantId, checkInCount}:{restaurantId:string, checkInCount:number}) => {
  const restaurant = api.restaurant.getByPlaceId.useQuery({placeId: restaurantId})
if (restaurant.isLoading) <RestaurantCardSkeleton/>
//@ts-ignore
  const data: IGoogleRestaurantResult = restaurant.data || [];
  return ( <div>
      <h1>{checkInCount}: check ins</h1>
            <RestaurantCard restaurant={data} key={restaurant.data?.place_id} index={ 1} />
  </div> );
}
 


const CommentCardSkeleton = () => {
  return (
    <div>
      <div className=" flex w-64 flex-col gap-2 overflow-hidden rounded-lg border-2  bg-white px-2 pt-2">
        <div className="flex gap-4">
          <div className="avatar rounded-md border-2">
            <Skeleton variant="rectangular" width={40} height={40} />
          </div>

          <div className="w-32">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </div>
        </div>

        <div className="flex flex-col gap-2 px-2">
          <div className="w-full">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </div>
          <div className="w-full">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </div>
          <div className="w-full">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </div>
          <div className="w-full">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-700"></p>
        </div>
      </div>
    </div>
  );
};  
interface IPopularInfo {
  restaurant_id: string;
  checkInCount:number
}

const User: NextPage = () => {
  const comments = api.comment.getRecent.useQuery();
  const checkIns = api.checkIn.getAll.useQuery()

  const result = checkIns.data?.reduce((acc, item) => {
    const restaurantId = item.restaurant_id;
    //@ts-ignore
    acc[restaurantId] = (acc[restaurantId] || 0) + 1;
    return acc;
  }, {}) || [];
  
  const reducedData:IPopularInfo[] = Object?.entries(result)?.map(([restaurantId, checkInCount]) => ({
    restaurant_id: restaurantId,
    checkInCount: checkInCount as number,
  }))
  const sortedData = reducedData.sort((a, b) => a.checkInCount + b.checkInCount);


  
  return (
    <>
      <Head>
        <title>Foodley</title>  
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold">Popular Restaurants</h2>
            <div className="flex flex-col flex-wrap items-center gap-4 md:flex-row md:items-start">
            {sortedData?.map((checkIn)=>{
              return  <RestaurantWithCheckIn restaurantId={checkIn.restaurant_id} checkInCount={checkIn.checkInCount} />
            })}
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold">Latest Reviews</h2>
            <div className="flex flex-col flex-wrap items-center gap-4 md:flex-row md:items-start">
              {!comments.isLoading ? (
                <>
                  {comments.data?.map((elem) => {
                    return (
                      <div>
                        <CommentCard comment={elem} key={elem.id} />
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                  <CommentCardSkeleton />
                </>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default User;
