import { useRouter } from "next/router";
import { useLoadScript } from "@react-google-maps/api";
import { useRef, useState } from "react";
import React from "react";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { motion } from "framer-motion";
import AppsIcon from "@mui/icons-material/Apps";
import { IconButton } from "@mui/material";
import { Point } from "./forms/Map";
import { Autocomplete } from "./forms/Autocomplete";
import { getGeocode, getLatLng } from "use-places-autocomplete";
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
  setMapCenter: (center: Point) => void;
  setSearchRadiusInMiles: (radius: number) => void;
  searchRadiusInMiles: number;
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
  const { city, state, setCity, setState, setMapCenter } = props;
  const router = useRouter();
  // @ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const [autocomplete, setAutocomplete] = useState(null);
  const [showRadiusModal, setShowRadiusModal] = useState(false);
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

    getGeocode({ address: `${destination.city}, ${destination.state}` }).then(
      (results) => {
        if (!results.length || results[0] === undefined) return;
        const { lat, lng } = getLatLng(results[0]);
        setMapCenter({ lat, lng });
      }
    );

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
  const searchRadiusOptions = [
    { value: 5, label: "5 miles" },
    { value: 10, label: "10 miles" },
    { value: 15, label: "15 miles" },
    { value: 20, label: "20 miles" },
    { value: 25, label: "25 miles" },
    { value: 50, label: "50 miles" },
  ];
  return (
    <div className="relative bg-transparent ">
      {loadError && (
        <div>Google Map script can't be loaded, please reload the page</div>
      )}

      {isLoaded && (
        <div className="flex w-full  gap-2">
          <Autocomplete
            setCity={setCity}
            setState={setState}
            city={city}
            state={state}
            setMapCenter={setMapCenter}
          />
          <IconButton
            onClick={() => {
              setShowRadiusModal(!showRadiusModal);
            }}
          >
            <LocationSearchingIcon />
          </IconButton>
        </div>
      )}
      {showRadiusModal && (
        <div className="z-100 bg-priamry fixed  right-0 mt-2 flex flex-col  gap-1 rounded-lg border-2 border-black bg-primary p-2 text-white">
          {searchRadiusOptions.map((option) => (
            <div
              className="cursor-pointer hover:bg-gray-500"
              onClick={() => {
                props.setSearchRadiusInMiles(option.value);
                setShowRadiusModal(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
