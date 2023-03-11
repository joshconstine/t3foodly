"use client";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "../../utils/api";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";

import RestaurantResults from "./RestaurantResults";
import { motion } from "framer-motion";
import { Autocomplete } from "../../components/forms/Autocomplete";
import Map, { Point } from "../../components/forms/Map";
const center = {
  lat: 32.715,
  lng: -117.16,
};
const Restaurant: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [markers, setMarkers] = useState<any>([]);
  const [mapCenter, setMapCenter] = useState(center);
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

  const apiRestaurants = api.restaurant.getByCityAndState.useQuery({
    city,
    state,
  });
  const dbRestaurants = api.restaurant.getByCityAndStateFromDB.useQuery({
    city,
    state,
  });

  useEffect(() => {
    let markersToAdd: Point[] = [];
    if (
      apiRestaurants.status === "success" &&
      dbRestaurants.status === "success"
    )
      if (apiRestaurants.status === "success") {
        const markers = apiRestaurants.data?.map((restaurant) => {
          return {
            lat: Number(restaurant.lat),
            lng: Number(restaurant.lng),
          };
        });
        markersToAdd = [...markersToAdd, ...markers];
      }
    if (dbRestaurants.status === "success") {
      const markers = dbRestaurants.data?.map((restaurant) => {
        return {
          lat: Number(restaurant.lat),
          lng: Number(restaurant.lng),
        };
      });
      markersToAdd = [...markersToAdd, ...markers];
    }
    setMarkers(markersToAdd);
  }, [apiRestaurants.data, dbRestaurants.data]);

  const handleSearchByCity = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      city: { value: string };
      state: { value: string };
    };
    setCity(formElements.city.value);
    setState(formElements.state.value);
    router.push(
      `/restaurant?city=${formElements.city.value}&state=${formElements.state.value}`
    );
    window.localStorage.setItem("city", city);
    window.localStorage.setItem("state", state);
  };
  useMemo(() => {
    if (apiRestaurants.status === "success") {
      window.localStorage.setItem(
        "restaurants",
        JSON.stringify(apiRestaurants.data)
      );
    }
  }, [apiRestaurants.data, apiRestaurants.status]);

  return (
    <>
      <Head>
        <title>Foodley</title>
        <meta name="description" content="find great local restaurants" />
        <link rel="icon" href="/favicon.ico" />
        <script
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${
            process.env.NEXT_PUBLIC_PLACES_KEY
              ? process.env.NEXT_PUBLIC_PLACES_KEY
              : ""
          }&libraries=places`}
        ></script>
      </Head>
      <Layout>
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <div className="flex w-full flex-col  items-center gap-2 ">
              <div className=" mx-2 flex w-full flex-col-reverse items-center justify-between gap-4 rounded-lg border-2 px-8 py-4 px-4 md:flex-row">
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

                <Autocomplete
                  setCity={setCity}
                  setState={setState}
                  setMapCenter={setMapCenter}
                />

                <Image
                  width={160}
                  height={160}
                  src="/static/photos/Gradianticon.png"
                  alt="Clock Image"
                  className="relative hidden md:block"
                  z-index={0}
                />
              </div>

              <div
                className=" w-full  justify-center md:flex md:justify-between "
                style={{
                  height: "calc(100vh - 350px)",
                }}
              >
                <div className="min-w-3/4  flex  flex-col gap-4 p-4">
                  <div className="flex w-96 flex-col gap-4">
                    <h1 className="relative  text-2xl font-bold text-primary">
                      Results
                    </h1>
                    <span>
                      Results with pictures have been reviewed by our users
                    </span>
                  </div>
                  <RestaurantResults
                    dbRestaurants={dbRestaurants.data}
                    apiRestaurants={apiRestaurants.data}
                  />
                </div>
                <div className={` relative left-0 top-0 z-10 h-full w-full  `}>
                  <Map mapCenter={mapCenter} markers={markers} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Restaurant;
