import Link from "next/link";
import { api } from "../../../utils/api";

const Comment = ({ text, userId }: { text: string, userId: string }) => {

    const username = api.user.getUsername.useQuery({ id: userId })
    return (
        <div>
            {username.data}
            {text}
        </div>
    );
}

export default Comment;