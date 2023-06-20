"use client";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../../utils/api";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import RestaurantResults from "./RestaurantResults";
import { motion } from "framer-motion";
import Map, { IMarker, Point } from "../../components/forms/Map";
import RestaurantSearchForm from "../../components/RestaurantsSearchForm";
import FocusedRestaurantCard from "../../components/RestaurantCards/FocusedRestaurantCard";
import { useLoadScript } from "@react-google-maps/api";
import CuisineFilter from "./CuisineFilter";
import { Cuisine } from "@prisma/client";
const center = {
  lat: 32.715,
  lng: -117.16,
};
const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};
const Restaurant: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [mapCenter, setMapCenter] = useState(center);
  const [searchRadiusInMiles, setSearchRadiusInMiles] = useState<number>(20);
  //@ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);

  const [focusedRestaurant, setFocusedRestaurant] = useState<string | null>(
    null
  );
  const cuisines = api.cuisine.getAll.useQuery();
  const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);
  const ids = selectedCuisines.map((elem) => elem.id);
  useEffect(() => {
    if (params.city) {
      localStorage.setItem("city", String(params.city));
    }
    if (params.state) {
      localStorage.setItem("state", String(params.state));
    }
  }, [params]);
  useEffect(() => {
    if (localStorage.getItem("city") && localStorage.getItem("city") !== null) {
      const searchedCity = localStorage.getItem("city");
      setCity(searchedCity || "");
    }
    if (localStorage.getItem("state") && localStorage.getItem("state")) {
      const searchedState = localStorage.getItem("state");
      setState(searchedState || "");
    }
  }, []);

  const dbRestaurants = api.restaurant.getByLatLong.useQuery({
    latitude: mapCenter.lat,
    longitude: mapCenter.lng,
    searchRadiusInMeters: searchRadiusInMiles * 1609.34,
  });
  const dbRestaurantsMinimal = api.restaurant.getByLatLong.useQuery({
    latitude: mapCenter.lat,
    longitude: mapCenter.lng,
    searchRadiusInMeters: searchRadiusInMiles * 1609.34,
  });
  const filterd = dbRestaurantsMinimal?.data?.filter((elem) => {
    if (selectedCuisines.length === 0) {
      return true;
    } else if (elem.cuisines) {
      return elem.cuisines.some((elem) => ids.includes(elem.cuisine.id));
    }
  });
  console.log("new data", dbRestaurantsMinimal?.data);
  useMemo(() => {
    let markersToAdd: IMarker[] = [];
    if (dbRestaurants.status === "success")
      if (dbRestaurants.status === "success") {
        const markers = dbRestaurants.data?.map(
          (restaurant: { lat: any; lng: any; name: any; id: any }) => {
            return {
              location: {
                lat: Number(restaurant.lat),
                lng: Number(restaurant.lng),
              },
              name: restaurant.name,
              id: restaurant.id,
            };
          }
        );
        markersToAdd = [...markersToAdd, ...markers];
      }
    setMarkers(markersToAdd);
  }, [, dbRestaurants.data]);

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
          <section className="py-12">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
              <div className="flex w-full flex-col  items-center gap-2 ">
                <div className=" mx-2 flex w-full flex-col-reverse items-center justify-between gap-4 rounded-lg border-2 px-8 py-4 md:flex-row">
                  <div>
                    <span>Dont see your favorite</span>
                    <div>
                      <Link href="/restaurant/create">
                        <motion.div
                          className="rounded-full bg-secondary py-2 px-4 font-bold text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Add restaurant
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                  <RestaurantSearchForm
                    setCity={setCity}
                    setState={setState}
                    city={city}
                    state={state}
                    setMapCenter={setMapCenter}
                    setSearchRadiusInMiles={setSearchRadiusInMiles}
                    searchRadiusInMiles={searchRadiusInMiles}
                  />
                  <div></div>
                </div>

                <div className=" flex w-full  flex-col justify-center md:h-special md:flex-row ">
                  <div className="lg flex w-full flex-col gap-4 md:w-860  md:min-w-860 md:overflow-auto ">
                    <div className="min-w-96 flex flex-col gap-4">
                      <h1 className="text-l  relative font-bold text-primary">
                        {`${filterd?.length} ${
                          filterd &&
                          (filterd?.length === 0 || filterd.length > 1)
                            ? "Restaurants"
                            : "Restaurant"
                        }`}
                      </h1>
                    </div>
                    {cuisines && (
                      <CuisineFilter
                        cuisines={cuisines?.data || []}
                        selectedCuisines={selectedCuisines}
                        setCuisines={setSelectedCuisines}
                      />
                    )}
                    {focusedRestaurant && (
                      <FocusedRestaurantCard restaurantId={focusedRestaurant} />
                    )}
                    <RestaurantResults restaurants={filterd} />
                  </div>
                  <div className="min-w-96 relative left-0 top-0 h-full w-full">
                    <Map
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
