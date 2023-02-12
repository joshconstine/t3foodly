import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex gap-8">
      <Link href="/">Home</Link>
      <Link href="/restaurant">Restaurants</Link>
      <Link href="/restaurantApplications">Restaurant Applications</Link>
      <Link href="/profile">profile</Link>
    </div>
  );
};

export default Navbar;
