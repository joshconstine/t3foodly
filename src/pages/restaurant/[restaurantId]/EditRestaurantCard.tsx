import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import Image from "next/image";
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
      cuisineType: { value: string };
      email: { value: string };
      website: { value: string };
      phone: { value: string };
      hoursInterval: { value: string };
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
          hoursInterval: formElements.hoursInterval.value,
          cuisineType: formElements.cuisineType.value,
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
  const createPhoto = api.photo.createPhoto.useMutation();
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
  return (
    <div>
      <h1>Edit Restaurant Card</h1>
      <div className=" m-4 p-4">
        <h1 className="text-2xl text-primary">Current Restaurant Data</h1>
        <p>Restaurant ID: {restaurantId}</p>
        <p>Restaurant Name: {restaurant.data?.name}</p>
        <p>Restaurant Address: {restaurant.data?.address}</p>
        <p>Restaurant City: {restaurant.data?.cityName}</p>
        <p>Restaurant State: {restaurant.data?.stateName}</p>
        <p>Restaurant Zip: {restaurant.data?.zipCode}</p>
        <p>Restaurant Phone: {restaurant.data?.phone}</p>
        <p>Restaurant Website: {restaurant.data?.website}</p>
        <p>Restaurant Hours: {restaurant.data?.hoursInterval}</p>
        <p>Restaurant Lat: {restaurant.data?.lat}</p>
        <p>Restaurant Lng: {restaurant.data?.lng}</p>
      </div>
      <form
        onSubmit={handleUpdate}
        className="m-4 flex w-64 flex-col  whitespace-nowrap p-4"
      >
        <h1 className="text-2xl text-primary">Update Restaurant Data</h1>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          className="bg-gray-200"
          placeholder="Restaurant name"
          defaultValue={restaurant?.data?.name}
        ></input>{" "}
        <label>Address:</label>
        <input
          type="text"
          name="address"
          className="bg-gray-200"
          placeholder="Restaurant address"
          defaultValue={
            restaurant?.data?.address ? restaurant?.data?.address : ""
          }
        ></input>
        <label>City:</label>
        <input
          type="text"
          name="city"
          className="bg-gray-200"
          placeholder="city"
          defaultValue={restaurant?.data?.cityName}
        ></input>
        <label>State:</label>
        <input
          type="text"
          name="state"
          className="bg-gray-200"
          placeholder="state"
          defaultValue={restaurant?.data?.stateName}
        ></input>
        <label>Zip Code:</label>
        <input
          type="text"
          name="zipCode"
          className="bg-gray-200"
          placeholder="zipcode"
          defaultValue={restaurant?.data?.zipCode}
        ></input>{" "}
        <label>Cuisine Type:</label>
        <input
          type="text"
          name="cuisineType"
          className="bg-gray-200"
          placeholder="cuisine"
          defaultValue={
            restaurant?.data?.cuisineType ? restaurant.data.cuisineType : ""
          }
        ></input>{" "}
        <label>Email:</label>
        <input
          type="text"
          name="email"
          className="bg-gray-200"
          placeholder="email"
          defaultValue={restaurant?.data?.email ? restaurant.data.email : ""}
        ></input>{" "}
        <label>website:</label>
        <input
          type="text"
          name="website"
          className="bg-gray-200"
          placeholder="website"
          defaultValue={
            restaurant?.data?.website ? restaurant.data.website : ""
          }
        ></input>{" "}
        <label>Hours:</label>
        <input
          type="text"
          name="hoursInterval"
          className="bg-gray-200"
          placeholder="hours of operation"
          defaultValue={
            restaurant?.data?.hoursInterval ? restaurant.data.hoursInterval : ""
          }
        ></input>{" "}
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          className="bg-gray-200"
          placeholder="phone number"
          defaultValue={restaurant?.data?.phone ? restaurant.data.phone : ""}
        ></input>
        <button
          className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
          type="submit"
        >
          save
        </button>
        <button
          type="button"
          className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
          onClick={() => {
            setEditMode(false);
          }}
        >
          close
        </button>
      </form>
      <div className=" m-4 p-4">
        <h1 className="text-2xl text-primary">Add A photo</h1>
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
            onChange={(e) => storeFile(e)}
          />
        </label>
        {file && (
          <div>
            <Image src={preview || ""} alt={"photo"} width={400} height={200} />
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
    </div>
  );
};

export default EditRestaurantCard;
