import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};

export default function SearchForm() {
  const router = useRouter();
  // @ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      types: ["(cities)"],
    },
    debounce: 300,
  });
  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      setValue(description, false);
      clearSuggestions();

      getGeocode({ address: description }).then((results) => {
        if (results.length === 0 || results[0] === undefined) return;
        const city = results[0]?.address_components.find((elem) =>
          elem.types.includes("locality")
        )?.long_name;
        const state = results[0]?.address_components.find((elem) =>
          elem.types.includes("administrative_area_level_1")
        )?.short_name;
        if (city && state) {
          router.push(`/restaurant?city=${city}&state=${state}`);
        }
      });
    };
  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          style={{ cursor: "pointer" }}
          className="py-2 px-4 hover:bg-gray-100"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  const handleInput = (e: any) => {
    // Update the keyword of the input element

    setValue(e.target?.value);
  };

  if (loadError) return <div>error loading autocomplete</div>;
  if (!isLoaded) return <div>loading...</div>;
  if (isLoaded && ready)
    return (
      <div className="relative z-10 bg-transparent">
        <React.Fragment>
          <div>
            <input
              value={value}
              onChange={handleInput}
              disabled={!ready}
              placeholder="Where are you going?"
              className="w-full rounded-full bg-transparent py-2 px-8 focus:outline-none "
            />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && (
              <div className="absolute rounded-lg bg-white p-4 shadow-lg">
                <ul>{renderSuggestions()}</ul>
              </div>
            )}
          </div>
        </React.Fragment>
      </div>
    );
  else return <div>loading...</div>;
}
