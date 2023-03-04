import { api } from "../../../utils/api";

import Image from "next/image";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
interface IProps {
  restaurantId: string;
}
const CreateCommentContainer = (props: IProps) => {
  const { restaurantId } = props;
  const createComment = api.comment.createComment.useMutation();
  const comments = api.comment.getByRestaurantId.useQuery({
    id: restaurantId,
  });
  const createPhoto = api.photo.createPhoto.useMutation();

  const [preview, setPreview] = useState<undefined | string>();
  const [file, setFile] = useState<any>();

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const storeFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const uploadedFile = input.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      comment: { value: string };
    };

    createComment.mutate(
      { text: formElements.comment.value, restaurantId: restaurantId },
      {
        onSuccess(commentData) {
          const uploadPhoto = async () => {
            try {
              let { data } = await axios.post("/api/s3/upload-url", {
                name: file.name,
                type: file.type,
              });
              const url = data.url;

              let res = await axios.put(url, file, {
                headers: {
                  "Content-type": file.type,
                  "Access-Control-Allow-Origin": "*",
                },
              });
              setFile(null);
              if (res.status === 200) {
                createPhoto.mutate({
                  commentId: commentData.id,
                  photoUrl: `https://foodly-bucket.s3.us-west-1.amazonaws.com/${file.name}`,
                });
              } else {
                console.error("Upload failed.");
              }
            } catch (e) {
              console.log(e);
            }
          };
          uploadPhoto();
          comments.refetch();
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        <h3 className="mb-4 text-lg font-bold">Leave a comment</h3>
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="mb-2 block font-bold text-gray-700"
          >
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            className="form-textarea  h-32 w-full rounded-md border-2 border-secondary shadow-sm "
            required
          />
        </div>
        {file && (
          <Image src={preview || ""} alt={"photo"} width={400} height={200} />
        )}
        <div>
          <input type="file" onChange={(e) => storeFile(e)} />
        </div>
        <div>
          <button
            type="submit"
            className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommentContainer;
