import Link from "next/link";
import { api } from "../utils/api";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { IconButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
const Navbar = () => {
  const user = api.user.getUser.useQuery();
  const { data: sessionData } = useSession();
  const [expanded, setExpanded] = useState(false);
  return (
    <nav className="relative z-10 flex w-full flex-col content-center items-center bg-primary py-2 text-white">
      <div className="flex w-full  max-w-7xl items-center justify-between gap-2  sm:px-6 md:flex-row lg:px-8 ">
        <Image
          width={100}
          height={25}
          src="/static/photos/logo.svg"
          alt="logo"
        />
        <div>
          <div className="flex flex-wrap items-center gap-8 text-xs">
            <Link
              href="/restaurant"
              className="flex  items-center gap-1 rounded-md "
            >
              <RestaurantIcon />
              Restaurants
            </Link>
            <Link
              href="/discover"
              className="flex  items-center gap-1 rounded-md "
            >
              <SearchIcon />
              Discover
            </Link>
            {user.data?.role === "ADMIN" && sessionData && (
              <>
                <Link href="/restaurantApplications" className="rounded-md  ">
                  Restaurant Applications
                </Link>
                <Link href="/admin" className="rounded-md  ">
                  Admin Dashboard
                </Link>
                <Link href="/reportedItems" className="rounded-md ">
                  Reported Items
                </Link>
              </>
            )}
            {sessionData && (
              <>
                <Link
                  href="/restaurant/create"
                  className="flex  items-center gap-1 rounded-md "
                >
                  <AddCircleOutlineIcon />
                  Add Restaurant
                </Link>
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image
                      width={45}
                      height={45}
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
              </>
            )}
            {!sessionData && (
              <div>
                <button onClick={() => signIn()} className="btn-secondary  btn">
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
