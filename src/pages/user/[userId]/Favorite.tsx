import Link from "next/link";
import { api } from "../../../utils/api";

const Favorite = ({ id }: { id: string }) => {

    const favorites = api.favorite.getByUserId.useQuery({ id: id })
    console.log(favorites.data)
    return (
        <div>


        </div>
    );
}

export default Favorite;