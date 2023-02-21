import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY,
  libraries: ["places"],
};

export default function SearchForm({ action }) {
  const router = useRouter();
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const [autocomplete, setAutocomplete] = useState(null);
  const inputEl = useRef(null);

  // Handle the keypress for input
  const onKeypress = (e) => {
    // On enter pressed
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onLoad = (autocompleteObj) => {
    setAutocomplete(autocompleteObj);
  };

  const onPlaceChanged = (e) => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if ("place_id" in place) {
        router.push(`/place/${place.place_id}`);
      }
    }
  };

  return (
    <div className="bg-transparent">
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
              className="bg-transparent py-2 px-4 focus:outline-none"
              onKeyPress={onKeypress}
            />
          </Autocomplete>
        </React.Fragment>
      )}
    </div>
  );
}
