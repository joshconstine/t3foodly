import Link from "next/link";
import { api } from "../utils/api";

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
              href="/restaurantApplications"
              className="rounded-md px-3 py-2 text-sm font-medium"
            >
              Restaurant Applications
            </Link>{" "}
            <Link
              href="/discover"
              className="rounded-md px-3 py-2 text-sm font-medium"
            >
              Discover
            </Link>
          </div>
          <Link href="/profile">
            <img
              className="w-12 rounded-full"
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
