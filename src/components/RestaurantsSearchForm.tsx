import { useRouter } from "next/router";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";
import React from "react";
import { motion } from "framer-motion";

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

export default function RestaurantSearchForm(props: ISearchFormProps) {
  const { city, state, setCity, setState } = props;
  const router = useRouter();
  // @ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const [autocomplete, setAutocomplete] = useState(null);
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
          <Autocomplete
            onLoad={onLoad}
            fields={["place_id"]}
            onPlaceChanged={onPlaceChanged}
            className="bg-transparent"
          >
            <motion.input
              whileFocus={{ scale: 1.1 }}
              ref={inputEl}
              defaultValue={city && state ? `${city}, ${state}` : ""}
              type="text"
              placeholder="Type keywords..."
              className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
              onKeyPress={onKeypress}
            />
          </Autocomplete>
        </div>
      )}
    </div>
  );
}
