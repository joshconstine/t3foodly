import { Restaurant, RestaurantApplication } from "@prisma/client";
import axios from "axios";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import CityForm from "../../components/forms/CityForm";
import { api } from "../../utils/api";
import ConfirmModal from "./ConfirmModal";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Check from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
const steps = [
  "Restaurant Information",
  "Restaurant Location",
  "Restaurant Photos",
  "Review",
];
import PreviewIcon from "@mui/icons-material/Preview";
import RestaurantCard from "../../components/RestaurantCards/RestaurantCard";
const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));
function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <InfoIcon />,
    2: <LocationOnIcon />,
    3: <ImageSearchIcon />,
    4: <PreviewIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));
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
    restaurantName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    lat: string;
    lng: string;
    restaurantEmail: string;
    website: string;
    restaurantPhone: string;
    hoursInterval: string;
  }
  const initialValues: FormValues = {
    restaurantName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    lat: "0",
    lng: "0",
    restaurantEmail: "",
    website: "",
    restaurantPhone: "",
    hoursInterval: "",
  };
  const createPhoto = api.photo.createPhoto.useMutation();
  const handleSubmit = (values: FormValues) => {
    createRestaurant.mutate(
      {
        name: values.restaurantName,
        lat: values.lat,
        lng: values.lng,
        address: values.address,
        cityName: values.city,
        stateName: values.state,
        zipCode: values.zipCode,
        email: values.restaurantEmail,
        phone: values.restaurantPhone,
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
    const makeRestaurant = (): any => {
      return {
        id: "11111",
        name: props.values.restaurantName,
        cityName: props.values.cityName,
        stateName: props.values.stateName,
        zipCode: props.values.zipCode,
        email: "",
        phone: "",
        address: "",
        website: "",
        hoursInterval: "",
        lat: "",
        lng: "",
        created_at: new Date(),
        cuisines: [],
      };
    };
    if (activeStep === 0) {
      return (
        <Box className="m-4 flex w-2/3 flex-col gap-4 p-4">
          <Field
            className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
            id={"restaurantName"}
            name={"restaurantName"}
            type="text"
            placeholder={"restaurant name"}
          />
          <Field
            className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
            id={"restaurantEmail"}
            name={"restaurantEmail"}
            type="text"
            placeholder={"email"}
          />
          <Field
            className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
            id={"restaurantPhone"}
            name={"restaurantPhone"}
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
        </Box>
      );
    } else if (activeStep === 1) {
      return (
        <div>
          <div className="my-16 max-w-xl p-4 py-16">
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
          <div className="my-16 flex max-w-xl flex-col gap-4 p-4 py-16">
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
        <div className="m-8 flex flex-col items-center p-4">
          <div className="flex w-64 flex-col gap-2 py-8">
            <li>name: {props.values?.restaurantName}</li>

            <li>address: {props.values?.address}</li>
            <li>city: {props.values?.city}</li>
            <li>state: {props.values?.state}</li>
            <li>zipCode: {props.values?.zipCode}</li>
            <li>email: {props.values?.restaurantEmail}</li>
            <li>phone: {props.values?.restaurantPhone}</li>
            <li>website: {props.values?.website}</li>
            <li>hoursInterval: {props.values?.hoursInterval}</li>
          </div>
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
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
          </Box>
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
                <Stepper
                  alternativeLabel
                  activeStep={activeStep}
                  connector={<ColorlibConnector />}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
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
