import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};
interface ISearchFormProps {
  setCity: (city: string) => void;
  setState: (state: string) => void;
}

export default function CityForm({ setCity, setState }: ISearchFormProps) {
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
    const city = inputs[0].trim();
    const state = inputs[1].trim();

    if (autocomplete) {
      // @ts-ignore
      const place = autocomplete.getPlace();
      if (city && state) {
        setCity(city);
        setState(state);
      }
    }
  };

  return (
    <div className="relative z-10 bg-transparent">
      {loadError && (
        <div>Google Map script can't be loaded, please reload the page</div>
      )}

      {isLoaded && (
        <React.Fragment>
          <Autocomplete
            onLoad={onLoad}
            fields={["place_id"]}
            onPlaceChanged={onPlaceChanged}
            className="bg-transparent"
          >
            <input
              ref={inputEl}
              type="text"
              placeholder="Type keywords..."
              className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
              onKeyPress={onKeypress}
            />
          </Autocomplete>
        </React.Fragment>
      )}
    </div>
  );
}
