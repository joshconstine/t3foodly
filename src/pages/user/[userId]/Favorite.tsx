import Link from "next/link";
import { api } from "../../../utils/api";

const Favorite = ({ id }: { id: string }) => {

    const restaurant = api.restaurant.getById.useQuery({ id: id })
    return (
        <div>

            <Link href={`/restaurant/${restaurant.data?.id}`}>
                {restaurant.data?.name}
            </Link>
        </div>
    );
}

export default Favorite;