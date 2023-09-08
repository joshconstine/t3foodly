"use client";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../../utils/api";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import RestaurantResults from "./RestaurantResults";
import { motion } from "framer-motion";
import Map, { IRestaurantMarker } from "../../components/forms/Map";
import RestaurantSearchForm from "../../components/RestaurantsSearchForm";
import FocusedRestaurantCard from "../../components/RestaurantCards/FocusedRestaurantCard";
import { useLoadScript } from "@react-google-maps/api";
import { Cuisine } from "@prisma/client";
import Skeleton from "@mui/material/Skeleton";
const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};
export const RestaurantCardSkeleton = () => {
  return (
    <div className=" h-32 ">
      <div className="flex gap-1">
        <Skeleton variant="circular" width={100} height={100} />

        <div className="md:ap-2 flex w-32 flex-col  ">
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <div className="w-8">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </div>
          <div className="w-16">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </div>

          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        </div>
      </div>
    </div>
  );
};
const Restaurant: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  const center = {
    lat: Number(params.lat) || 32.715,
    lng: Number(params.lng) || -117.16,
  };

  // var config = {
  //   method: "get",
  //   headers: {},
  // };

  // useEffect(() => {}, []);
  const [city, setCity] = useState<string>(
    String(params.city || "San Diego") || ""
  );
  const [state, setState] = useState<string>(
    String(params.state || "CA") || ""
  );
  const [mapCenter, setMapCenter] = useState(center);
  const [markers, setMarkers] = useState<IRestaurantMarker[]>([]);

  const [searchRadiusInMiles, setSearchRadiusInMiles] = useState<number>(20);
  const dbRestaurants = api.restaurant.getByLatLong.useQuery({
    latitude: mapCenter.lat,
    longitude: mapCenter.lng,
    searchRadiusInMeters: searchRadiusInMiles * 1609.34,
  });
  const apiRestaurants = api.restaurant.getByCityAndState.useQuery({
    lat: String(mapCenter.lat),
    lng: String(mapCenter.lng),
    radius: searchRadiusInMiles * 1609.34,
  });
  //@ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);

  const [focusedRestaurant, setFocusedRestaurant] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const cuisines = api.cuisine.getAll.useQuery();
  const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);
  const ids = selectedCuisines.map((elem) => elem.id);
  //@ts-ignore
  const allRestaurants =
    dbRestaurants?.data && apiRestaurants?.data
      ? [...dbRestaurants?.data, ...apiRestaurants?.data]
      : [];

  //@ts-ignore
  const filterd = allRestaurants.filter((elem) => {
    if (selectedCuisines.length === 0) {
      return true;
    } else if (elem.cuisines) {
      //@ts-ignore
      return elem.cuisines.some((elem) => ids.includes(elem.cuisine.id));
    }
  });
  useMemo(() => {
    let markersToAdd: IRestaurantMarker[] = [];
    if (dbRestaurants.status === "success") {
      //@ts-ignore
      const markers = dbRestaurants.data?.map(
        (restaurant: { lat: any; lng: any; name: any; id: any }) => {
          return {
            location: {
              lat: Number(restaurant.lat),
              lng: Number(restaurant.lng),
            },
            restaurant: restaurant,
            id: restaurant.id,
          };
        }
      );
      markersToAdd = [...markersToAdd, ...markers];
    }
    setMarkers(markersToAdd);
  }, [, dbRestaurants.data]);
  //@ts-ignore
  const isNoData = dbRestaurants?.data?.length === 0;
  // console.log(isNoData);
  if (loadError) return <div>Map cannot be loaded right now, sorry.</div>;
  if (!isLoaded) return <div>Loading...</div>;
  if (isLoaded)
    return (
      <>
        <Head>
          <title>Foodley</title>
          <meta name="description" content="find great local restaurants" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <section className="">
            <div className="mx-auto max-w-screen-2xl	px-4 sm:px-6  lg:px-8">
              <div className="flex  flex-col  items-center gap-2 ">
                <div className=" reverse flex items-center  justify-between  gap-4 rounded-lg px-8 py-4 md:flex-row">
                  <RestaurantSearchForm
                    setCity={setCity}
                    setState={setState}
                    city={city}
                    state={state}
                    setMapCenter={setMapCenter}
                    setSearchRadiusInMiles={setSearchRadiusInMiles}
                    searchRadiusInMiles={searchRadiusInMiles}
                  />
                </div>
                <div className=" flex h-full w-full  flex-col gap-8 md:flex-row">
                  <div>
                    {dbRestaurants.isLoading ? (
                      <div className="lg  flex-col gap-4 md:w-860  md:min-w-860 md:overflow-auto ">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 md:p-4">
                          {new Array(10).fill(true).map((elem, index) => (
                            <RestaurantCardSkeleton key={index} />
                          ))}
                        </div>
                      </div>
                    ) : isNoData ? (
                      <div className="lg my-8 flex w-full flex-col items-center gap-4 md:w-860 md:min-w-860 md:overflow-auto ">
                        <h1 className="text-2xl font-bold text-primary">
                          No Restaurants Found
                        </h1>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-l whitespace-nowrap rounded-lg border-2 border-secondary px-2 py-2 text-secondary"
                        >
                          <Link href="/restaurant/create">Add Restaurant</Link>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4    md:overflow-auto ">
                        <div className=" flex  gap-4">
                          <h1 className="md:text-l   font-bold text-primary">
                            {`${filterd?.length} ${
                              filterd &&
                              (filterd?.length === 0 || filterd.length > 1)
                                ? `Restaurants found in ${searchRadiusInMiles} miles of ${city}, ${state}`
                                : "Restaurant"
                            }`}
                          </h1>
                        </div>
                        <div>
                          {focusedRestaurant && (
                            <FocusedRestaurantCard
                              restaurantId={focusedRestaurant}
                            />
                          )}
                          <RestaurantResults restaurants={filterd} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="min-w-96  left-0 top-0 h-full w-full">
                    <Map
                      radius={searchRadiusInMiles}
                      mapCenter={mapCenter}
                      markers={markers}
                      setFocusedRestaurant={setFocusedRestaurant}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
    );
  else return <div></div>;
};

export default Restaurant;
