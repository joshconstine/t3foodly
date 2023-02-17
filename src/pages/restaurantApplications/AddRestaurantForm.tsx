import { RestaurantApplication } from "@prisma/client";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { api } from "../../utils/api";
import ConfirmModal from "./ConfirmModal";

const AddRestaurantForm = () => {
  const createRestaurant =
    api.restaurantApplication.createRestaurantApplication.useMutation();
  const restaurantApplications = api.restaurantApplication.getAll.useQuery();
  const [submitting, setSubmitting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [createdApplication, setCreatedApplication] =
    useState<RestaurantApplication | null>(null);
  const [file, setFile] = useState<any>();
  const createPhoto = api.photo.createPhoto.useMutation();
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    setSubmitting(true);
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
    createRestaurant.mutate(
      {
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
      },
      {
        async onSuccess(applicationData) {
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
                  applicationId: applicationData.id,
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
          setCreatedApplication(applicationData);
          formElements.name.value = "";
          formElements.address.value = "";
          formElements.city.value = "";
          formElements.state.value = "";
          formElements.zipCode.value = "";
          formElements.email.value = "";
          formElements.phone.value = "";
          formElements.website.value = "";
          formElements.hoursInterval.value = "";
          formElements.cuisineType.value = "";
          setSubmitting(false);
          setConfirmModalOpen(true);
          await restaurantApplications.refetch();
        },
      }
    );
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
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block font-bold text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="mb-2 block font-bold text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="mb-2 block font-bold text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="state" className="mb-2 block font-bold text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="zipCode"
            className="mb-2 block font-bold text-gray-700"
          >
            ZIP Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>{" "}
        <div className="mb-4">
          <label
            htmlFor="cuisineType"
            className="mb-2 block font-bold text-gray-700"
          >
            Cuisine Type
          </label>
          <input
            type="text"
            id="cuisineType"
            name="cuisineType"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>{" "}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block font-bold text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>{" "}
        <div className="mb-4">
          <label
            htmlFor="website"
            className="mb-2 block font-bold text-gray-700"
          >
            website
          </label>
          <input
            type="text"
            id="website"
            name="website"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>{" "}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block font-bold text-gray-700">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>{" "}
        <div className="mb-4">
          <label
            htmlFor="hoursInterval"
            className="mb-2 block font-bold text-gray-700"
          >
            hours
          </label>
          <input
            type="text"
            id="hoursInterval"
            name="hoursInterval"
            className="form-input block w-full rounded-md shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          add a photo
          <input type="file" onChange={(e) => storeFile(e)} />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <ConfirmModal
        restaurant={createdApplication}
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
      />
    </div>
  );
};

export default AddRestaurantForm;
