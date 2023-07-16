import { ChangeEvent, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import Image from "next/image";
import axios from "axios";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
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
      <label className="flex h-16 w-16 cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-primary bg-white px-4 transition hover:border-gray-400 focus:outline-none md:h-32">
        <span className="flex items-center space-x-2">
          <AddPhotoAlternateIcon />
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
