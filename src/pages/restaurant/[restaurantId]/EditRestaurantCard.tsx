import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import Image from "next/image";
import AddMenu from "./AddMenu";
import Menu from "./Menu";
import Photos from "./Photos";
import CuisineFilter from "../CuisineFilter";
import { Cuisine } from "@prisma/client";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
interface IProps {
  restaurantId: string;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditRestaurantCard = (props: IProps) => {
  const { restaurantId, setEditMode } = props;
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  const updateRestaurant = api.restaurant.updateRestaurant.useMutation();
  const photos = api.photo.getByRestaurantId.useQuery({ id: restaurantId });
  const [file, setFile] = useState<any>();
  const [preview, setPreview] = useState<undefined | string>();

  const cuisines = api.cuisine.getAll.useQuery();
  const clearCuisines = api.restaurantCuisine.deleteByRestaurant.useMutation();
  const createCuisine =
    api.restaurantCuisine.createRestaurantCuisine.useMutation();
  const restaurantCuisines = api.restaurantCuisine.getByRestaurantId.useQuery({
    restaurantId: restaurantId,
  });
  const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);

  useEffect(() => {
    if (cuisines?.data && restaurantCuisines?.data) {
      const selectedCuisines = cuisines.data.filter((cuisine) => {
        return restaurantCuisines.data.some(
          (restaurantCuisine) => restaurantCuisine.cuisine_id === cuisine.id
        );
      });
      setSelectedCuisines(selectedCuisines);
    }
  }, [cuisines.data, restaurantCuisines.data]);

  const createPhoto = api.photo.createPhoto.useMutation();
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

  const handleUpdate = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      name: { value: string };
      address: { value: string };
      city: { value: string };
      state: { value: string };
      zipCode: { value: string };
      email: { value: string };
      website: { value: string };
      phone: { value: string };
    };
    if (restaurant?.data)
      updateRestaurant.mutate(
        {
          id: String(restaurantId),
          name: formElements.name.value,
          address: formElements.address.value,
          cityName: formElements.city.value,
          stateName: formElements.state.value,
          zipCode: formElements.zipCode.value,
          email: formElements.email.value,
          phone: formElements.phone.value,
          website: formElements.website.value,
          hoursInterval: "",
          lat: Number(restaurant.data.lat),
          lng: Number(restaurant.data.lng),
        },
        {
          async onSuccess() {
            await restaurant.refetch();
            // setEditMode(false);
          },
        }
      );
  };
  const handleSetCuisines = () => {
    if (selectedCuisines.length > 0) {
      clearCuisines.mutate(
        { restaurantId: restaurantId },
        {
          onSuccess() {
            createCuisine.mutate(
              {
                restaurantId: restaurantId,
                cuisines: selectedCuisines,
              },
              {
                onSuccess() {
                  restaurantCuisines.refetch();
                },
              }
            );
          },
        }
      );
    }
  };

  const handleSubmit = () => {
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
          createPhoto.mutate(
            {
              restaurantId: restaurantId,
              photoUrl: `https://foodly-bucket.s3.us-west-1.amazonaws.com/${file.name}`,
            },
            {
              onSuccess() {
                photos.refetch();
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
  const storeFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const uploadedFile = input.files[0];
    setFile(uploadedFile);
  };
  const RestaurantInfoForm = () => {
    return (
      <form
        onSubmit={handleUpdate}
        className="m-4 flex w-64 flex-wrap  whitespace-nowrap p-4"
      >
        <h1 className="text-2xl text-primary">Update Restaurant Data</h1>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          className="input-bordered input-secondary input w-full max-w-xs"
          placeholder="Restaurant name"
          defaultValue={restaurant?.data?.name}
        ></input>{" "}
        <label>Address:</label>
        <input
          type="text"
          name="address"
          className="input-bordered input-secondary input w-full max-w-xs"
          placeholder="Restaurant address"
          defaultValue={
            restaurant?.data?.address ? restaurant?.data?.address : ""
          }
        ></input>
        <label>City:</label>
        <input
          type="text"
          name="city"
          className="input-bordered input-secondary input w-full max-w-xs"
          placeholder="city"
          defaultValue={restaurant?.data?.cityName}
        ></input>
        <label>State:</label>
        <input
          type="text"
          name="state"
          className="input-bordered input-secondary input w-full max-w-xs"
          placeholder="state"
          defaultValue={restaurant?.data?.stateName}
        ></input>
        <label>Zip Code:</label>
        <input
          type="text"
          name="zipCode"
          className="input-bordered input-secondary input w-full max-w-xs"
          placeholder="zipcode"
          defaultValue={restaurant?.data?.zipCode}
        ></input>{" "}
        <label>Email:</label>
        <input
          type="text"
          name="email"
          className="input-bordered input-secondary input w-full max-w-xs"
          placeholder="email"
          defaultValue={restaurant?.data?.email ? restaurant.data.email : ""}
        ></input>{" "}
        <label>website:</label>
        <input
          type="text"
          name="website"
          className="input-bordered input-secondary input w-full max-w-xs"
          placeholder="website"
          defaultValue={
            restaurant?.data?.website ? restaurant.data.website : ""
          }
        ></input>{" "}
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          className="input-bordered input-secondary input w-full max-w-xs"
          placeholder="phone number"
          defaultValue={restaurant?.data?.phone ? restaurant.data.phone : ""}
        ></input>
        <div className="flex justify-between">
          <button className="btn-primary btn" type="submit">
            save
          </button>
          <button
            type="button"
            className="btn-secondary btn-outline btn"
            onClick={() => {
              setEditMode(false);
            }}
          >
            close
          </button>
        </div>
      </form>
    );
  };
  return (
    <dialog open className="max-w-2xl rounded-lg border-2 bg-slate-200 p-4">
      <button
        className="btn-primary btn"
        onClick={() => {
          restaurant.refetch();
          setEditMode(false);
        }}
      >
        Return to public view
      </button>
      <RestaurantInfoForm />
      <div className=" m-4 p-4">
        <h1 className="text-2xl text-primary">Current Photos</h1>
        <Photos restaurantId={restaurantId} />
        <h1 className="text-2xl text-primary">Add A photo</h1>
        <div>
          <label className="flex h-16 w-16 cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-primary bg-white px-4 transition hover:border-gray-400 focus:outline-none md:h-32">
            <span className="flex items-center space-x-2">
              <AddPhotoAlternateIcon />
            </span>
            <input
              type="file"
              name="file_upload"
              className="hidden"
              onChange={(e) => storeFile(e)}
            />
          </label>
        </div>
        {file && (
          <div className="flex items-center gap-4">
            <Image src={preview || ""} alt={"photo"} width={400} height={200} />
            <div>
              <button
                className="btn-primary btn"
                type="submit"
                onClick={handleSubmit}
              >
                save
              </button>
            </div>
          </div>
        )}
      </div>{" "}
      <div>
        <h1 className="text-2xl text-primary">Update Cuisines</h1>
        <div className="flex items-center">
          {cuisines && (
            <CuisineFilter
              cuisines={cuisines?.data || []}
              selectedCuisines={selectedCuisines}
              setCuisines={setSelectedCuisines}
            />
          )}
          <button className="btn-primary btn" onClick={handleSetCuisines}>
            save
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl text-primary">Current Menu</h1>
        </div>
        <Menu restaurantId={restaurantId} />
        <AddMenu restaurantId={restaurantId} />
      </div>
    </dialog>
  );
};

export default EditRestaurantCard;
