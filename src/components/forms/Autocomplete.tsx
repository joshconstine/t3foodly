import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import React, { useEffect } from "react";
import { Point } from "./Map";

interface IAutocomplete {
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setMapCenter: (center: Point) => void;
  city: string;
  state: string;
}
export const Autocomplete = (props: IAutocomplete) => {
  const { setCity, setState, setMapCenter, city, state } = props;
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
      /* Define search scope here */
    },
    debounce: 300,
  });
  useEffect(() => {
    if (city && state) {
      setValue(`${city}, ${state}`, false);
    }
  }, [city, state, setValue]);
  const handleInput = (e: any) => {
    // Update the keyword of the input element

    setValue(e.target?.value);
  };

  const libraries = ["places"];

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        if (results.length === 0 || results[0] === undefined) return;
        const { lat, lng } = getLatLng(results[0]);
        // setMapCenter({ lat, lng });
        // setMarkers([{ lat: lat, lng: lng }]);
        setMapCenter({ lat, lng });
        const city = results[0]?.address_components.find((elem) =>
          elem.types.includes("locality")
        )?.long_name;
        const state = results[0]?.address_components.find((elem) =>
          elem.types.includes("administrative_area_level_1")
        )?.short_name;
        if (city && state) {
          setCity(city);
          setState(state);
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
          className="py-2 px-4 text-white hover:bg-gray-500"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        onFocus={() => {
          setValue("");
        }}
        placeholder="Where are you going?"
        className="input-bordered input-primary input join-item "
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <div className="fixed z-10 mt-2 flex flex-col gap-2 rounded-md border-2 border-black bg-primary p-2">
          <ul>{renderSuggestions()}</ul>
        </div>
      )}
    </>
  );
};
