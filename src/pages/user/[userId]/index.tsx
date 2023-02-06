import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../../../utils/api";
import { URLSearchParams } from "url";
import { useRouter } from "next/router";
import { FormEventHandler } from "react";
import Navbar from "../../../components/Navbar";
import Favorite from "./Favorite";

const User: NextPage = () => {
    const router = useRouter()
    const { userId } = router.query

    const user = api.user.getUserPageData.useQuery({ id: String(userId) });


    return (
        <>
            <Head>
                <title>Foodly</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main >
                <Navbar />
                <div className="flex flex-col">
                    <div>

                        user page
                    </div>
                    <div>
                        <div>
                            <span className="font-bold">
                                username:
                            </span>


                            {user.data?.username}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-lg">Favorites</div>
                        {user.data?.favorites?.map((elem) => {
                            return <Favorite id={elem} />
                        })}
                    </div>




                </div>
            </main>
        </>
    );
};


export default User;

