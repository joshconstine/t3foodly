import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 py-4 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="text-xl font-bold">
              Restaurant Reviews
            </a>
          </div>
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
            </Link>
            <Link
              href="/profile"
              className="rounded-md px-3 py-2 text-sm font-medium"
            >
              profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
