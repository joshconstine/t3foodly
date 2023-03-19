import { ChangeEvent, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import Image from "next/image";
import axios from "axios";
interface IProps {
  restaurantId: string;
}
const AddMenu = (props: IProps) => {
  const { restaurantId } = props;
  const [menuFile, setMenuFile] = useState<any>();
  const [menuPreview, setMenuPreview] = useState<undefined | string>();
  const createMenu = api.menu.createMenu.useMutation();
  const menu = api.menu.getByRestaurantId.useQuery({ id: restaurantId });
  useEffect(() => {
    if (!menuFile) {
      setMenuPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(menuFile);
    setMenuPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [menuFile]);
  const storeMenuFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const uploadedFile = input.files[0];
    setMenuFile(uploadedFile);
  };
  const handleSubmit = () => {
    const uploadPhoto = async () => {
      try {
        let { data } = await axios.post("/api/s3/upload-url", {
          name: menuFile.name,
          type: menuFile.type,
        });
        const url = data.url;

        let res = await axios.put(url, menuFile, {
          headers: {
            "Content-type": menuFile.type,
            "Access-Control-Allow-Origin": "*",
          },
        });
        setMenuFile(null);
        if (res.status === 200) {
          createMenu.mutate(
            {
              restaurantId: restaurantId,
              photoUrl: `https://foodly-bucket.s3.us-west-1.amazonaws.com/${menuFile.name}`,
            },
            {
              onSuccess() {
                menu.refetch();
              },
            }
          );
        } else {
          console.error("Upload failed.");
        }
      } catch (e) {
        console.log(e);
      }
    };
    uploadPhoto();
  };
  return (
    <div className=" m-4 p-4">
      <h1 className="text-2xl text-primary">Add Menu</h1>
      <label className="flex h-32 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-gray-400 focus:outline-none">
        <span className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="font-medium text-gray-600">
            Drop files to Attach, or
            <span className="text-blue-600 underline">browse</span>
          </span>
        </span>
        <input
          type="file"
          name="file_upload"
          className="hidden"
          onChange={(e) => storeMenuFile(e)}
        />
      </label>
      {menuFile && (
        <div>
          <Image
            src={menuPreview || ""}
            alt={"photo"}
            width={400}
            height={200}
          />
          <button
            className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
            type="submit"
            onClick={handleSubmit}
          >
            save
          </button>
        </div>
      )}
    </div>
  );
};

export default AddMenu;
