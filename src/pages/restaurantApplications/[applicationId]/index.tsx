import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";

import Image from "next/image";
import SimelarRestaurants from "../SimelarRestaurants";
import { getGeocode, getLatLng } from "use-places-autocomplete";
const SingleRestaurantApplication = () => {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const { applicationId } = router.query;

  const restaurantApplication = api.restaurantApplication.getById.useQuery({
    id: String(applicationId),
  });
  const applications = api.restaurantApplication.getAll.useQuery();
  const deleteApplication = api.restaurantApplication.delete.useMutation();
  const deletePhotos = api.photo.deleteByApplication.useMutation();
  const updateApplciation =
    api.restaurantApplication.updateApplication.useMutation();
  const updatePhoto = api.photo.handlePublish.useMutation();
  const createRestaurant = api.restaurant.createRestaurant.useMutation();
  const photos = api.photo.getByApplicationId.useQuery({
    id: String(applicationId),
  });
  const userName = api.user.getUsername.useQuery({
    id: restaurantApplication?.data?.created_by_user_id || "",
  });
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
      hoursInterval: { value: string };
    };
    if (restaurantApplication?.data)
      updateApplciation.mutate(
        {
          id: String(applicationId),
          name: formElements.name.value,
          address: formElements.address.value,
          cityName: formElements.city.value,
          stateName: formElements.state.value,
          zipCode: formElements.zipCode.value,
          email: formElements.email.value,
          phone: formElements.phone.value,
          website: formElements.website.value,
          hoursInterval: formElements.hoursInterval.value,
          status: "updated",
          created_by_user_id: restaurantApplication?.data?.created_by_user_id,
        },
        {
          async onSuccess() {
            await restaurantApplication.refetch();
            setEditMode(false);
          },
        }
      );
  };
  const handleReject = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteApplication.mutate(
      { applicationId: String(applicationId) },
      {
        async onSuccess() {
          deletePhotos.mutate({
            applicationid: String(applicationId),
          });
          router.push("/restaurantApplications");
        },
      }
    );
  };
  const handlePublish = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    if (restaurantApplication.data) {
      getGeocode({
        address: `${restaurantApplication.data.address} ${restaurantApplication.data.cityName} ${restaurantApplication.data.stateName} ${restaurantApplication.data.zipCode}`,
      }).then((results) => {
        if (results.length === 0 || results[0] === undefined) return;
        const { lat, lng } = getLatLng(results[0]);
        createRestaurant.mutate(
          {
            name: restaurantApplication?.data?.name
              ? restaurantApplication.data.name
              : "",
            address: restaurantApplication?.data?.address
              ? restaurantApplication.data.address
              : "",
            cityName: restaurantApplication?.data?.cityName
              ? restaurantApplication.data.cityName
              : "",
            stateName: restaurantApplication?.data?.stateName
              ? restaurantApplication.data.stateName
              : "",
            zipCode: restaurantApplication?.data?.zipCode
              ? restaurantApplication.data.zipCode
              : "",
            email: restaurantApplication?.data?.email
              ? restaurantApplication.data.email
              : "",
            phone: restaurantApplication?.data?.phone
              ? restaurantApplication.data.phone
              : "",
            website: restaurantApplication?.data?.website
              ? restaurantApplication.data.website
              : "",
            hoursInterval: restaurantApplication?.data?.hoursInterval
              ? restaurantApplication.data.hoursInterval
              : "",

            lat: String(lat),
            lng: String(lng),
          },
          {
            async onSuccess(restaurantData) {
              if (restaurantApplication.data)
                updateApplciation.mutate({
                  id: restaurantApplication.data?.id,
                  name: restaurantApplication.data.name,
                  address: restaurantApplication.data.address
                    ? restaurantApplication.data.address
                    : "",
                  cityName: restaurantApplication.data.cityName,
                  stateName: restaurantApplication.data.stateName,
                  zipCode: restaurantApplication.data.zipCode,
                  email: restaurantApplication.data.email
                    ? restaurantApplication.data.email
                    : "",
                  phone: restaurantApplication.data.phone
                    ? restaurantApplication.data.phone
                    : "",
                  website: restaurantApplication.data.website
                    ? restaurantApplication.data.website
                    : "",
                  hoursInterval: restaurantApplication.data.hoursInterval
                    ? restaurantApplication.data.hoursInterval
                    : "",

                  status: "created",
                  created_by_user_id:
                    restaurantApplication.data.created_by_user_id,
                });
              if (restaurantApplication.data)
                updatePhoto.mutate({
                  applicationId: restaurantApplication.data.id,
                  restaurantId: restaurantData.id,
                });

              applications.refetch();
              restaurantApplication.refetch();

              router.push(`/restaurant/${restaurantData.id}`);
            },
          }
        );
      });
    }
  };

  if (restaurantApplication.status === "loading") return <>loading</>;
  if (restaurantApplication.status === "error") return <>error</>;
  if (restaurantApplication.status === "success")
    return (
      <>
        <Head>
          <title>Foodley</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <div>
            <div className="flex flex-col gap-4">
              <div>
                {" "}
                {photos.data && photos.data.length > 0 && (
                  <Image
                    width={200}
                    height={200}
                    src={photos.data ? String(photos.data.at(0)?.photoUrl) : ""}
                    alt="Restaurant Image"
                  />
                )}
                <div>{`Application #${restaurantApplication?.data?.id}`} </div>
                <div>
                  Application created---
                  {restaurantApplication.data?.created_at.toLocaleDateString()}
                </div>
                <div>{`status: ${restaurantApplication.data?.status}`}</div>
                <Link
                  href={`/user/${restaurantApplication?.data?.created_by_user_id}`}
                >
                  <div>{`created by : ${userName?.data}`}</div>
                </Link>
                <div className="flex w-20 flex-col gap-1">
                  <button
                    className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
                    onClick={handlePublish}
                  >
                    pubish
                  </button>{" "}
                  <button
                    className="rounded-full bg-yellow-500 py-2 px-4 font-bold text-white hover:bg-yellow-700"
                    onClick={() => {
                      setEditMode(!editMode);
                    }}
                  >
                    edit
                  </button>{" "}
                  <button
                    className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
                    onClick={handleReject}
                  >
                    reject
                  </button>
                </div>
              </div>
              {!editMode && (
                <div>
                  <div>{`name: ${restaurantApplication.data?.name}`}</div>
                  <div>{`address: ${restaurantApplication.data?.address}`}</div>
                  <div>{`hours: ${restaurantApplication.data?.hoursInterval}`}</div>
                  <div>{`phone: ${restaurantApplication.data?.phone}`}</div>
                  <div>{`website: ${restaurantApplication.data?.website}`}</div>{" "}
                  <div>{`city: ${restaurantApplication.data?.cityName}`}</div>
                  <div>{`state: ${restaurantApplication.data?.stateName}`}</div>
                  <div>{`zip-code: ${restaurantApplication.data?.zipCode}`}</div>
                  <div>{`email: ${restaurantApplication.data?.email}`}</div>
                </div>
              )}
            </div>
          </div>
          {editMode && (
            <form onSubmit={handleUpdate} className="flex w-48 flex-col">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                className="bg-gray-200"
                placeholder="Restaurant name"
                defaultValue={restaurantApplication?.data?.name}
              ></input>{" "}
              <label>Address:</label>
              <input
                type="text"
                name="address"
                className="bg-gray-200"
                placeholder="Restaurant address"
                defaultValue={
                  restaurantApplication?.data?.address
                    ? restaurantApplication?.data?.address
                    : ""
                }
              ></input>
              <label>City:</label>
              <input
                type="text"
                name="city"
                className="bg-gray-200"
                placeholder="city"
                defaultValue={restaurantApplication?.data?.cityName}
              ></input>
              <label>State:</label>
              <input
                type="text"
                name="state"
                className="bg-gray-200"
                placeholder="state"
                defaultValue={restaurantApplication?.data?.stateName}
              ></input>
              <label>Zip Code:</label>
              <input
                type="text"
                name="zipCode"
                className="bg-gray-200"
                placeholder="zipcode"
                defaultValue={restaurantApplication?.data?.zipCode}
              ></input>{" "}
              <label>Email:</label>
              <input
                type="text"
                name="email"
                className="bg-gray-200"
                placeholder="email"
                defaultValue={
                  restaurantApplication?.data?.email
                    ? restaurantApplication.data.email
                    : ""
                }
              ></input>{" "}
              <label>website:</label>
              <input
                type="text"
                name="website"
                className="bg-gray-200"
                placeholder="website"
                defaultValue={
                  restaurantApplication?.data?.website
                    ? restaurantApplication.data.website
                    : ""
                }
              ></input>{" "}
              <label>Hours:</label>
              <input
                type="text"
                name="hoursInterval"
                className="bg-gray-200"
                placeholder="hours of operation"
                defaultValue={
                  restaurantApplication?.data?.hoursInterval
                    ? restaurantApplication.data.hoursInterval
                    : ""
                }
              ></input>{" "}
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                className="bg-gray-200"
                placeholder="phone number"
                defaultValue={
                  restaurantApplication?.data?.phone
                    ? restaurantApplication.data.phone
                    : ""
                }
              ></input>
              <button type="submit">save</button>
            </form>
          )}
          <SimelarRestaurants
            city={restaurantApplication?.data?.cityName || "999"}
            state={restaurantApplication?.data?.stateName || "999"}
            name={restaurantApplication?.data?.name || "999"}
          />
        </Layout>
      </>
    );
};

export default SingleRestaurantApplication;
