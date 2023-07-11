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
import { getGeocode, getLatLng } from "use-places-autocomplete";
const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};

const Restaurant: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  const center = {
    lat: Number(params.lat) || 32.715,
    lng: Number(params.lng) || -117.16,
  };

  const [city, setCity] = useState<string>(
    String(params.city || "San Diego") || ""
  );
  const [state, setState] = useState<string>(
    String(params.state || "CA") || ""
  );
  const [mapCenter, setMapCenter] = useState(center);
  const [markers, setMarkers] = useState<IMarker[]>([]);

  //@ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);

  const [searchRadiusInMiles, setSearchRadiusInMiles] = useState<number>(20);

  const [focusedRestaurant, setFocusedRestaurant] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const cuisines = api.cuisine.getAll.useQuery();
  const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);
  const ids = selectedCuisines.map((elem) => elem.id);

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
  //@ts-ignore
  const filterd = dbRestaurantsMinimal?.data?.filter((elem) => {
    if (selectedCuisines.length === 0) {
      return true;
    } else if (elem.cuisines) {
      //@ts-ignore
      return elem.cuisines.some((elem) => ids.includes(elem.cuisine.id));
    }
  });
  useMemo(() => {
    let markersToAdd: IMarker[] = [];
    if (dbRestaurants.status === "success")
      if (dbRestaurants.status === "success") {
        //@ts-ignore
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
          <section className="md:py-12">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
              <div className="flex  flex-col  items-center gap-2 ">
                <div className=" rounded-lgpx-8 reverse  flex  items-center justify-between gap-4 py-4 md:flex-row">
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

                <div className=" flex w-full flex-col  md:h-special md:flex-row ">
                  <div className="lg flex w-full flex-col gap-4 md:w-860  md:min-w-860 md:overflow-auto ">
                    <div className="min-w-96 flex  gap-4">
                      <h1 className="md:text-l   font-bold text-primary">
                        {`${filterd?.length} ${
                          filterd &&
                          (filterd?.length === 0 || filterd.length > 1)
                            ? `Restaurants found in ${searchRadiusInMiles} miles of ${city}, ${state}`
                            : "Restaurant"
                        }`}
                      </h1>
                      {/* <button
                        className="text-l   rounded-full border-2 py-2  px-2 font-bold font-bold text-primary text-white"
                        onClick={() => {
                          setShowFilters(!showFilters);
                        }}
                      >
                        filters
                      </button> */}
                    </div>
                    {showFilters && (
                      <div>
                        {cuisines && (
                          <CuisineFilter
                            cuisines={cuisines?.data || []}
                            selectedCuisines={selectedCuisines}
                            setCuisines={setSelectedCuisines}
                          />
                        )}
                      </div>
                    )}
                    {focusedRestaurant && (
                      <FocusedRestaurantCard restaurantId={focusedRestaurant} />
                    )}
                    <RestaurantResults restaurants={filterd} />
                  </div>
                  <div className="min-w-96 relative left-0 top-0 h-full w-full">
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
