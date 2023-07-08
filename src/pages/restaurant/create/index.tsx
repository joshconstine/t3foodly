import { type NextPage } from "next";
import Head from "next/head";

import Layout from "../../../components/Layout";
import AddRestaurantForm from "../../restaurantApplications/AddRestaurantForm";
import Image from "next/image";

const createRestaurant: NextPage = () => {
  return (
    <>
      <Head>
        <title>Foodley</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section className=" py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col">
              <h2 className="mb-8 text-3xl font-bold">
                Add restaurant to Foodley
              </h2>
              <p className="mt-4 w-1/2 text-lg text-primary">
                We are excited to add Your restaurant to Foodley. Please fill
                out the form below, If you are the manager of the restaurant and
                would like to have admin permissions check the box on step 4.
              </p>
              <p className="mt-4 w-1/2 text-lg text-primary">
                We review all applications internally. Thank you for helping the
                Fooldey community!
              </p>
              <div className="flex">
                <div className="mx-auto my-8 max-w-4xl px-4">
                  <AddRestaurantForm />
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
