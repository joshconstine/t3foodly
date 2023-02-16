import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "../../utils/api";
import { useEffect, useMemo, useState } from "react";
import { Restaurant } from "@prisma/client";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

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
  }, [apiRestaurants.data]);

  return (
    <>
      <Head>
        <title>Foodly</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-col gap-2">
          {" "}
          <div className="mx-auto my-8 max-w-4xl px-4">
            <form
              className="flex  content-center items-center gap-4 text-center"
              onSubmit={handleSearchByCity}
            >
              <label className="text-lg font-medium" htmlFor="city">
                City:
              </label>
              <input
                className="rounded-lg border border-gray-300 px-4 py-2"
                type="text"
                id="city"
                name="city"
                placeholder={city || "city"}
                defaultValue={city || ""}
              />

              <label className="text-lg font-medium" htmlFor="state">
                State:
              </label>
              <input
                className="rounded-lg border border-gray-300 px-4 py-2"
                type="text"
                id="state"
                name="state"
                placeholder={(state !== undefined && state) || "state"}
                defaultValue={(state !== undefined && state) || ""}
              />

              <button
                className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
          {dbRestaurants.data?.map((elem) => {
            return (
              <Link
                key={elem.id}
                className="flex flex-col"
                href={`restaurant/${elem.id}`}
              >
                <div>{elem.name}</div>
              </Link>
            );
          })}
          {apiRestaurants.data?.map((elem: Restaurant) => {
            return (
              <Link
                key={elem.id}
                className="flex flex-col"
                href={`restaurant/search/${elem.id}`}
              >
                <div>{elem.name}</div>
              </Link>
            );
          })}
        </div>
      </Layout>
    </>
  );
};

export default Restaurant;
