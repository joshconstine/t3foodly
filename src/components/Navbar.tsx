import Link from "next/link";
import { api } from "../utils/api";
import Image from "next/image";
const Navbar = () => {
  const user = api.user.getUser.useQuery();
  return (
    <nav className="bg-blue-500 py-4 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="hidden md:block">
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
          <Link href="/profile">
            <Image
              width={40}
              height={40}
              className=" rounded-full"
              src={user.data?.image || ""}
              alt="Profile Image"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
