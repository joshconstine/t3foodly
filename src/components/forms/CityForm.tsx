import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { getGeocode } from "use-places-autocomplete";
import { get } from "http";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};
interface ISearchFormProps {
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setAddress: (address: string) => void;
  setZipCode: (zipCode: string) => void;
  setLat: (lat: string) => void;
  setLng: (lng: string) => void;
}

export default function CityForm({
  setCity,
  setState,
  setAddress,
  setZipCode,
  setLat,
  setLng,
}: ISearchFormProps) {
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
    const input = inputEl.current?.value;
    const geocodeResp = await getGeocode({ address: input });
    const addressComponents = geocodeResp[0]?.address_components;
    if (addressComponents) {
      const city = addressComponents.find((c) =>
        c.types.includes("locality")
      )?.long_name;
      const state = addressComponents.find((c) =>
        c.types.includes("administrative_area_level_1")
      )?.short_name;
      const zipCode = addressComponents.find((c) =>
        c.types.includes("postal_code")
      )?.long_name;
      const lat = String(geocodeResp[0]?.geometry?.location?.lat());
      const lng = String(geocodeResp[0]?.geometry?.location?.lng());
      console.log(geocodeResp[0]?.geometry);
      const address = `${
        addressComponents.find((c) => c.types.includes("street_number"))
          ?.long_name || ""
      } ${addressComponents.find((c) => c.types.includes("route"))?.long_name}`;

      if (city && state) {
        setCity(city);
        setState(state);
      }
      if (zipCode) {
        if (!zipCode) return;
        setZipCode(zipCode);
      }
      if (lat && lng) {
        setLat(lat);
        setLng(lng);
      }
      if (address) {
        if (!address) return;
        setAddress(address);
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
              placeholder="Type Address"
              className="w-full rounded-full bg-gray-100 py-2 px-8 focus:outline-none "
              onKeyPress={onKeypress}
            />
          </Autocomplete>
        </React.Fragment>
      )}
    </div>
  );
}
