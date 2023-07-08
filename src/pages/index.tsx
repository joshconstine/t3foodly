"use client";
import { type NextPage } from "next";

import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchForm from "../components/forms/SearchForm";
import { useLoadScript } from "@react-google-maps/api";
const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};
const Home: NextPage = () => {
  const router = useRouter();
  router.push("/restaurant");
  // @ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const dropIn = {
    hidden: {
      y: "-100vh",
    },
    visable: {
      y: 0,
    },
    exit: {
      y: "-100vh",
    },
  };
  let autocomplete;

  return (
    <>
      <Head>
        <title>Foodley</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {" "}
        <section>
          <Image
            width={1600}
            height={800}
            src="/static/photos/Background.jpg"
            alt="Clock Image"
            className=" absolute top-0 z-0 h-full max-h-screen w-full "
          />
          <div className="mx-auto  max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex ">
              <div className="container mx-auto  flex flex-col flex-wrap  gap-20 px-4">
                <motion.div
                  initial={{ y: "-100vh" }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
                  variants={dropIn}
                  className="relative hidden self-start md:relative md:block"
                  z-index={0}
                >
                  <Image
                    width={300}
                    height={300}
                    src="/static/photos/clock.jpg"
                    alt="Clock Image"
                    className="relative"
                    z-index={0}
                  />
                </motion.div>
                <div className="relative z-10 flex flex-col items-center justify-center gap-2 py-16 md:justify-start md:py-0">
                  <h1 className="relative z-10 text-5xl font-bold text-primary">
                    Welcome
                  </h1>
                  <p className="mt-4 text-lg text-primary">
                    Search the city you would like to eat in below
                  </p>
                  {isLoaded && (
                    <form className=" flex max-w-md cursor-pointer items-center justify-between rounded-lg bg-gray-200 py-2 px-4">
                      <SearchForm />
                      <motion.div
                        onClick={() => router.push("/restaurant")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        <PlayArrowIcon />
                      </motion.div>
                    </form>
                  )}
                </div>
              </div>
              <Image
                width={600}
                height={400}
                src="/static/photos/hero.png"
                alt="Hero Image"
                className="hidden pt-32 md:relative md:block"
              />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Home;
