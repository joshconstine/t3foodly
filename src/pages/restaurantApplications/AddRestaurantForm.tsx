import { RestaurantApplication } from "@prisma/client";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ChangeEvent, useState } from "react";
import { api } from "../../utils/api";
import ConfirmModal from "./ConfirmModal";

const AddRestaurantForm = () => {
  const createRestaurant =
    api.restaurantApplication.createRestaurantApplication.useMutation();
  const restaurantApplications = api.restaurantApplication.getAll.useQuery();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [createdApplication, setCreatedApplication] =
    useState<RestaurantApplication | null>(null);
  const [file, setFile] = useState<any>();
  const [requestStep, setRequestStep] = useState(0);

  interface FormValues {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    cuisineType: string;
    email: string;
    website: string;
    phone: string;
    hoursInterval: string;
  }
  const initialValues: FormValues = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cuisineType: "",
    email: "",
    website: "",
    phone: "",
    hoursInterval: "",
  };
  const formSteps = [
    {
      forms: [
        {
          name: "name",
          label: "Restaurant Name",
        },
      ],
      heading: "Restaurant Name",
    },
    {
      forms: [
        {
          name: "city",
          label: "City",
        },
        {
          name: "state",
          label: "State",
        },
        {
          name: "zipCode",
          label: "Zip Code",
        },
      ],
      heading: "Restaurant Location",
    },
    {
      forms: [
        {
          name: "cuisineType",
          label: "Cuisine Type",
        },
      ],
      heading: "Restaurant Details",
    },
    {
      forms: [],
      heading: "Add a Photo",
    },
  ];
  const createPhoto = api.photo.createPhoto.useMutation();
  const handleSubmit = (values: FormValues) => {
    createRestaurant.mutate(
      {
        name: values.name,
        address: values.address,
        cityName: values.city,
        stateName: values.state,
        zipCode: values.zipCode,
        email: values.email,
        phone: values.phone,
        website: values.website,
        hoursInterval: values.hoursInterval,
        cuisineType: values.cuisineType,
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
  console.log(requestStep);
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          setConfirmModalOpen(true);
          handleSubmit(values);
          actions.resetForm();

          setRequestStep(0);
        }}
      >
        {(props) => (
          <Form className="mb-4">
            <h1 className="cursor-pointer font-bold text-gray-700 hover:text-gray-500">
              {formSteps[requestStep]?.heading}
            </h1>
            {formSteps[requestStep]?.forms.map((form, i) => (
              <div key={i} className="mb-4">
                <Field
                  className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                  id={form.name}
                  name={form.name}
                  type="text"
                  placeholder={form.label}
                />
              </div>
            ))}
            {requestStep === formSteps.length - 1 && (
              <div className="max-w-xl">
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
              </div>
            )}
            <button
              type="button"
              className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              onClick={() => {
                if (requestStep === formSteps.length - 1) {
                  props.handleSubmit();
                } else {
                  setRequestStep(requestStep + 1);
                }
              }}
            >
              {requestStep === formSteps.length - 1
                ? props.isSubmitting
                  ? "Submitting"
                  : "Submit"
                : "Next"}
            </button>
          </Form>
        )}
      </Formik>
      <ConfirmModal
        restaurant={createdApplication}
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
      />
    </div>
  );
};

export default AddRestaurantForm;
