import Link from "next/link";
import { api } from "../utils/api";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { IconButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useState } from "react";
const Navbar = () => {
  const user = api.user.getUser.useQuery();
  const { data: sessionData } = useSession();
  const [expanded, setExpanded] = useState(false);
  return (
    <nav className="relative z-10 bg-primary py-2 text-white">
      <div className=" sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2  md:flex-row">
          <Image
            width={100}
            height={25}
            src="/static/photos/logo.svg"
            alt="logo"
          />
          <div>
            <IconButton
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              <FormatListBulletedIcon sx={{ color: "white" }} />
            </IconButton>
            {expanded && (
              <div className="fixed top-16 right-2 rounded-md border-2 border-black bg-primary">
                <div className="flex flex-col gap-4 p-4">
                  <Link
                    href="/restaurant"
                    className="rounded-md px-3  text-sm font-medium"
                  >
                    Restaurants
                  </Link>
                  <Link
                    href="/restaurant/create"
                    className="rounded-md px-3 text-sm font-medium"
                  >
                    Add Restaurant
                  </Link>
                  <Link
                    href="/discover"
                    className="rounded-md px-3  text-sm font-medium"
                  >
                    Discover
                  </Link>
                  {user.data?.role === "ADMIN" && (
                    <>
                      <Link
                        href="/restaurantApplications"
                        className="rounded-md px-3  text-sm font-medium"
                      >
                        Restaurant Applications
                      </Link>
                      <Link
                        href="/admin"
                        className="rounded-md px-3  text-sm font-medium"
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        href="/reportedItems"
                        className="rounded-md px-3  text-sm font-medium"
                      >
                        Reported Items
                      </Link>
                    </>
                  )}
                  {sessionData && (
                    <Link href="/profile">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Image
                          width={30}
                          height={30}
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
