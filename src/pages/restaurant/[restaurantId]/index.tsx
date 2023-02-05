import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../../../utils/api";
import { URLSearchParams } from "url";
import { useRouter } from "next/router";
import { FormEventHandler } from "react";

const SingleRestaurant: NextPage = () => {
    const router = useRouter()
    const { restaurantId } = router.query

    const restaurant = api.restaurant.getById.useQuery({ id: Number(restaurantId) });

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formElements = form.elements as typeof form.elements & {
            comment: { value: string }
        }
        console.log(formElements.comment.value)
    }

    console.log(restaurant)
    if (restaurant.status === "loading") return <>loading</>
    if (restaurant.status === 'error') return <>error</>
    if (restaurant.status === 'success')
        return (
            <>
                <Head>
                    <title>Foodly</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-2xl text-white">
                            <div>{restaurant.data?.name}
                                {restaurant.data?.description}
                            </div>

                        </p>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <textarea rows={10} name='comment'></textarea>
                                <button type="submit" className="bg-white">add</button>
                            </form>
                        </div>
                    </div>
                </main>
            </>
        );
    else return <></>
};


export default SingleRestaurant;


