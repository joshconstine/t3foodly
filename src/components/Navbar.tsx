import Link from "next/link";
import { api } from "../utils/api";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
const Navbar = () => {
  const user = api.user.getUser.useQuery();
  const { data: sessionData } = useSession();
  return (
    <nav className="relative z-10 bg-primary py-4 text-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-2  md:flex-row">
          <Image
            width={163}
            height={65}
            src="/static/photos/logo.svg"
            alt="logo"
          />
          <div>
            <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link
              href="/restaurant"
              className="rounded-md px-3 py-2 text-sm font-medium"
            >
              Restaurants
            </Link>
            <Link
              href="/discover"
              className="rounded-md px-3 py-2 text-sm font-medium"
            >
              Discover
            </Link>
            {user.data?.role === "ADMIN" && (
              <>
                <Link
                  href="/restaurantApplications"
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  Restaurant Applications
                </Link>
                <Link
                  href="/admin"
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  Admin Dashboard
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={sessionData ? () => void signOut() : () => void signIn()}
              className={
                sessionData
                  ? "rounded-full border-2  border-secondary bg-transparent p-12 py-2 px-8 text-sm text-white"
                  : "rounded-full bg-secondary p-12 py-2 px-8 text-sm text-white"
              }
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
            {sessionData && (
              <Link href="/profile">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Image
                    width={40}
                    height={40}
                    className="rounded-full"
                    src={
                      user.data?.image && user.data?.image !== null
                        ? user.data?.image
                        : "/static/photos/profile.png"
                    }
                    alt="Profile Image"
                  />
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
