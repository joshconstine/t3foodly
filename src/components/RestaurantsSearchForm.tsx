import { useLoadScript } from "@react-google-maps/api";
import { SetStateAction, useRef, useState } from "react";
import React from "react";

import { Point } from "./forms/Map";
import { Autocomplete } from "./forms/Autocomplete";
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
  selectedCategories: string;
  setSelectedCategories: React.Dispatch<SetStateAction<string>>;
}
interface IDestination {
  name: string;
  city: string;
  state: string;
  country: string;
}

const categoryOptions = [
  {
    label: "Restaurant",
    value: "restaurant",
  },
  {
    label: "Bar",
    value: "bar",
  },
  {
    label: "Coffee",
    value: "coffee",
  },
  {
    label: "Clubs",
    value: "nightclub",
  },
];

export default function RestaurantSearchForm(props: ISearchFormProps) {
  const { city, state, setCity, setState, setMapCenter } = props;
  // @ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
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
      {!isLoaded && <div>Loading...</div>}
      <div className="join">
        <div>
          <div>
            <Autocomplete
              setCity={setCity}
              setState={setState}
              city={city}
              state={state}
              setMapCenter={setMapCenter}
            />
          </div>
        </div>
        <select
          value={props.searchRadiusInMiles}
          className="select-bordered select-primary select join-item"
          onChange={(e) => {
            props.setSearchRadiusInMiles(Number(e.target.value));
          }}
        >
          {searchRadiusOptions.map((option) => (
            <option
              key={option.value}
              className="option option-primary "
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={props.selectedCategories}
          className="select-bordered select-primary select join-item"
          onChange={(e) => {
            props.setSelectedCategories(e.target.value);
          }}
        >
          {categoryOptions.map((option) => (
            <option
              key={option.value}
              className="option option-primary "
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
