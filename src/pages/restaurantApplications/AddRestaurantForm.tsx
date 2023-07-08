import { RestaurantApplication } from "@prisma/client";
import axios from "axios";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import CityForm from "../../components/forms/CityForm";
import { api } from "../../utils/api";
import ConfirmModal from "./ConfirmModal";
import CuisineContainer from "./CuisineContainer";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = [
  "Restaurant Information",
  "Restaurant Location",
  "Restaurant Photos",
  "Review",
];

const AddRestaurantForm = () => {
  const createRestaurant =
    api.restaurantApplication.createRestaurantApplication.useMutation();
  const restaurantApplications = api.restaurantApplication.getAll.useQuery();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [createdApplication, setCreatedApplication] =
    useState<RestaurantApplication | null>(null);
  const [file, setFile] = useState<any>();
  const [preview, setPreview] = useState<undefined | string>();
  const [ref, bounds] = useMeasure();

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

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
  interface FormValues {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    lat: string;
    lng: string;
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
    lat: "0",
    lng: "0",
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
      forms: [],
      heading: "Restaurant Location",
    },
    {
      forms: [],
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
        lat: values.lat,
        lng: values.lng,
        address: values.address,
        cityName: values.city,
        stateName: values.state,
        zipCode: values.zipCode,
        email: values.email,
        phone: values.phone,
        website: values.website,
        hoursInterval: values.hoursInterval,
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
  const transition = { type: "ease", ease: "easeInOut", duration: ".4" };
  const renderStep = (props: any) => {
    if (activeStep === 0) {
      return (
        <div className="w-1/2">
          <Field
            className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
            id={"name"}
            name={"name"}
            type="text"
            placeholder={"restaurant name"}
          />
          <Field
            className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
            id={"email"}
            name={"email"}
            type="text"
            placeholder={"email"}
          />
          <Field
            className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
            id={"phone"}
            name={"phone"}
            type="text"
            placeholder={"phone"}
          />
          <Field
            className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
            id={"website"}
            name={"website"}
            type="text"
            placeholder={"website"}
          />
          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button onClick={handleNext}>Next</Button>
            </Box>
          </React.Fragment>
        </div>
      );
    } else if (activeStep === 1) {
      return (
        <div>
          <div className="max-w-xl">
            <CityForm
              setCity={(newVal) => props.setFieldValue("city", newVal)}
              setState={(newVal) => props.setFieldValue("state", newVal)}
              setAddress={(newVal) => props.setFieldValue("address", newVal)}
              setZipCode={(newVal) => props.setFieldValue("zipCode", newVal)}
              setLat={(newVal) => props.setFieldValue("lat", newVal)}
              setLng={(newVal) => props.setFieldValue("lng", newVal)}
            />
          </div>
          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button onClick={handleNext}>Next</Button>
            </Box>
          </React.Fragment>
        </div>
      );
    } else if (activeStep === 2) {
      return (
        <div>
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
            {file && (
              <Image
                src={preview || ""}
                alt={"photo"}
                width={400}
                height={200}
              />
            )}
          </div>

          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button onClick={handleNext}>Next</Button>
            </Box>
          </React.Fragment>
        </div>
      );
    } else {
      return (
        <div>
          {" "}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button onClick={handleNext}>Next</Button>
          </Box>
          <motion.button
            type="button"
            className="rounded-full bg-secondary py-2 px-4 font-bold text-white "
            onClick={() => {
              props.handleSubmit();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {props.isSubmitting ? "Submitting" : "Submit"}
          </motion.button>
        </div>
      );
    }
  };
  return (
    <>
      <>
        {" "}
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            actions.setSubmitting(false);
            setConfirmModalOpen(true);

            handleSubmit(values);
            actions.resetForm();
          }}
        >
          {(props) => (
            <Form className="mb-4 h-full w-full">
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                      optional?: React.ReactNode;
                    } = {};
                    if (isStepOptional(index)) {
                      labelProps.optional = (
                        <Typography variant="caption">Optional</Typography>
                      );
                    }
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {renderStep(props)}
              </Box>
            </Form>
          )}
        </Formik>
      </>
      <ConfirmModal
        restaurant={createdApplication}
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
      />
    </>
  );
};

export default AddRestaurantForm;
