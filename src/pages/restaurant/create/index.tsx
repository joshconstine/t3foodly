import { type NextPage } from "next";
import Head from "next/head";

import Layout from "../../../components/Layout";
import AddRestaurantForm from "../../restaurantApplications/AddRestaurantForm";
import Image from "next/image";

const createRestaurant: NextPage = () => {
  return (
    <>
      <Head>
        <title>Foodly</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section className=" py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col">
              <h2 className="mb-8 text-3xl font-bold">Create Restaurant</h2>
              <p className="mt-4 text-lg text-primary">
                We are excited to add Your local restaurant to our system.
                Please fill out the form below to add a restaurant.
              </p>
              <div className="flex">
                <div className="mx-auto my-8 max-w-4xl px-4">
                  <AddRestaurantForm />
                </div>
                <div>
                  <Image
                    width={600}
                    height={400}
                    src="/static/photos/3.png"
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

export default createRestaurant;
