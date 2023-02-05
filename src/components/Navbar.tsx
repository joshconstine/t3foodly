import Link from "next/link";

const Navbar = () => {
    return (
        <div>
            <Link href='/'>Home</Link>
            <Link href='/restaurant'>Restaurants</Link>
            <Link href='/profile'>profile</Link>
        </div>
    );
}

export default Navbar;