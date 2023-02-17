import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
const Home: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Foodly</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <header className="bg-white">
          <div className="relative h-96">
            <Image
              width={800}
              height={400}
              className="absolute h-full w-full object-cover"
              src="https://foodly-bucket.s3.us-west-1.amazonaws.com/joses.jpeg"
              alt="Hero Image"
            />
            <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center gap-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white">
                  Discover New Restaurants
                </h1>
                <p className="mt-4 text-lg text-white">
                  Find and review the best restaurants in your area
                </p>
                <div
                  onClick={() => router.push("/restaurant")}
                  className="p-18 rounded-full bg-blue-500 py-4 px-8 font-bold text-white hover:bg-blue-700"
                >
                  Get Started
                </div>{" "}
                <button
                  onClick={
                    sessionData ? () => void signOut() : () => void signIn()
                  }
                  className="p-18 rounded-full bg-blue-500 py-4 px-8 font-bold text-white hover:bg-blue-700"
                >
                  {sessionData ? "Sign out" : "Sign in"}
                </button>
              </div>
            </div>
          </div>
        </header>
      </Layout>
    </>
  );
};

export default Home;
