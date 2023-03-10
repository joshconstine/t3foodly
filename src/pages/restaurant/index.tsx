"use client";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "../../utils/api";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import RestaurantSearchForm from "../../components/RestaurantsSearchForm";
import RestaurantResults from "./RestaurantResults";
import { motion } from "framer-motion";

const Restaurant: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");

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
                <RestaurantSearchForm
                  city={city}
                  state={state}
                  setCity={setCity}
                  setState={setState}
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

              <div className="flex w-full justify-center md:justify-between ">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
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

                <div>
                  <Image
                    width={600}
                    height={400}
                    src="/static/photos/4.png"
                    alt="Hero Image"
                    className="hidden  md:relative md:block"
                  />
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
