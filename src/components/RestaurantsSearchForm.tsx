import { useRouter } from "next/router";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import AppsIcon from "@mui/icons-material/Apps";
import { IconButton } from "@mui/material";
const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};
interface ISearchFormProps {
  city: string;
  state: string;
  setCity: (city: string) => void;
  setState: (state: string) => void;
}
interface IDestination {
  name: string;
  city: string;
  state: string;
  country: string;
}
const destinations: IDestination[] = [
  {
    name: "New York",
    city: "New York",
    state: "NY",
    country: "USA",
  },
  {
    name: "Los Angeles",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
  },
  {
    name: "Chicago",
    city: "Chicago",

    state: "IL",
    country: "USA",
  },
  {
    name: "Houston",
    city: "Houston",
    state: "TX",
    country: "USA",
  },
  {
    name: "Phoenix",
    city: "Phoenix",
    state: "AZ",
    country: "USA",
  },
  {
    name: "Philadelphia",
    city: "Philadelphia",
    state: "PA",
    country: "USA",
  },
  {
    name: "San Antonio",
    city: "San Antonio",
    state: "TX",
    country: "USA",
  },
  {
    name: "San Diego",
    city: "San Diego",
    state: "CA",
    country: "USA",
  },
  {
    name: "Dallas",
    city: "Dallas",
    state: "TX",
    country: "USA",
  },
  {
    name: "San Jose",
    city: "San Jose",
    state: "CA",
    country: "USA",
  },
  {
    name: "Austin",
    city: "Austin",
    state: "TX",
    country: "USA",
  },
  {
    name: "Jacksonville",
    city: "Jacksonville",
    state: "FL",
    country: "USA",
  },
  {
    name: "San Francisco",
    city: "San Francisco",
    state: "CA",
    country: "USA",
  },
  {
    name: "Indianapolis",
    city: "Indianapolis",
    state: "IN",
    country: "USA",
  },
  {
    name: "Columbus",
    city: "Columbus",
    state: "OH",
    country: "USA",
  },
  {
    name: "Fort Worth",
    city: "Fort Worth",
    state: "TX",
    country: "USA",
  },
];

export default function RestaurantSearchForm(props: ISearchFormProps) {
  const { city, state, setCity, setState } = props;
  const router = useRouter();
  // @ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const [autocomplete, setAutocomplete] = useState(null);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const inputEl = useRef(null);

  // Handle the keypress for input
  const onKeypress = (e: any) => {
    // On enter pressed
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    }
  };

  const onLoad = (autocompleteObj: any) => {
    setAutocomplete(autocompleteObj);
  };
  let headers = new Headers();

  const onPlaceChanged = async () => {
    //@ts-ignore
    const inputs = inputEl.current?.value?.split(",");
    const newCity = inputs[0].trim();
    const newState = inputs[1].trim();

    if (autocomplete) {
      // @ts-ignore
      const place = autocomplete.getPlace();
      if (city && state) {
        //   router.push(`/restaurant?city=${city}&state=${state}`);
        setCity(newCity);
        setState(newState);
      } else if ("place_id" in place) {
        //   router.push(`/restaurant/?place=${place.place_id}`);
      }
    }
  };
  const handleClick = (destination: IDestination) => {
    setCity(destination.city);
    setState(destination.state);
    setShowDestinationModal(false);
    if (inputEl && inputEl.current) {
      // @ts-ignore
      inputEl.current.value = `${destination.city}, ${destination.state}`;
    }
    const autocomplete = document.getElementById("autocomplete");
    autocomplete?.setAttribute(
      "innerHTML",
      `${destination.city}, ${destination.state}`
    );
  };

  return (
    <div className="relative z-10 w-64 max-w-full bg-transparent md:w-1/3">
      {loadError && (
        <div>Google Map script can't be loaded, please reload the page</div>
      )}

      {isLoaded && (
        <div className="flex flex-col gap-2">
          <h1 className="relative z-10 text-3xl font-bold text-primary">
            Select a City
          </h1>
          <div className="flex ">
            <Autocomplete
              onLoad={onLoad}
              fields={["place_id"]}
              onPlaceChanged={onPlaceChanged}
              className="bg-transparent"
            >
              <motion.input
                whileFocus={{ scale: 1.1 }}
                ref={inputEl}
                id="autocomplete"
                defaultValue={city && state ? `${city}, ${state}` : ""}
                type="text"
                placeholder="Type keywords..."
                className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
                onKeyPress={onKeypress}
              />
            </Autocomplete>
            <IconButton onClick={() => setShowDestinationModal(true)}>
              <AppsIcon />
            </IconButton>
          </div>
          {showDestinationModal && (
            <motion.div
              onClick={() => setShowDestinationModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5/6 fixed top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-96 w-11/12 flex-col items-center gap-4 overflow-auto rounded-md bg-white p-4 shadow-md md:max-h-full md:max-w-2xl"
              >
                <div>
                  <h1 className="relative z-10 text-3xl font-bold text-primary">
                    Destinations
                  </h1>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {destinations.map((destination, i) => (
                    <motion.div
                      className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-md bg-gray-500"
                      key={i}
                      onClick={() => handleClick(destination)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div>{destination.name}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
