import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "../../utils/api";
import Layout from "../../components/Layout";
import RestaurantApplicationCard from "../../components/RestaurantApplicationCard";

const restaurantApplications: NextPage = () => {
  const restaurantApplications = api.restaurantApplication.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Foodly</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div>Open Applications</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {" "}
          {restaurantApplications.data?.map((elem) => {
            return (
              <Link
                key={elem.id}
                className="flex flex-col"
                href={`restaurantApplications/${elem.id}`}
              >
                <RestaurantApplicationCard restaurant={elem} />
              </Link>
            );
          })}
        </div>
      </Layout>
    </>
  );
};

export default restaurantApplications;
