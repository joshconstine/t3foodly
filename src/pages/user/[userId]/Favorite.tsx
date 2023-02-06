import Link from "next/link";
import { api } from "../../../utils/api";

const Favorite = ({ restaurantId }: { restaurantId: string }) => {
    const restaurant = api.restaurant.getById.useQuery({ id: restaurantId })
    return (
        <div>
            {restaurant.data?.name}

        </div>
    );
}

export default Favorite;