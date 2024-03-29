import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import { RestaurantWithCuisines } from "../../server/api/routers/restaurant";
import mapStyles from "../../styles/mapStyles";
import CustumCircle from "./CustomCircle";
import Image from "next/image";
import { api } from "../../utils/api";
import { width } from "@mui/system";

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};

export interface Point {
  lat: number;
  lng: number;
}
export interface IRestaurantMarker {
  location: Point;
  restaurant: RestaurantWithCuisines;
  id: string;
}
interface IMap {
  mapCenter: Point;
  markers: IRestaurantMarker[];
  radius: number;
  setFocusedRestaurant?: React.Dispatch<React.SetStateAction<string | null>>;
  width?: string;
  height?: string;
}
const RestaurantMarker = (props: {
  marker: IRestaurantMarker;
  setFocusedRestaurant?: (id: string) => void;
}) => {
  const { marker, setFocusedRestaurant } = props;

  const photos = api.photo.getByRestaurantId.useQuery({ id: marker.id });
  return (
    <OverlayView
      position={{ lat: marker.location.lat, lng: marker.location.lng }}
      key={`${marker.location.lat}-${marker.location.lng}`}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          if (setFocusedRestaurant) setFocusedRestaurant(String(marker.id));
        }}
        className="border-1  rounded-md border-black bg-primary p-2  font-bold  text-white shadow-md"
      >
        <div className="flex gap-1">
          <button>{marker.restaurant.name}</button>
        </div>
      </div>
    </OverlayView>
  );
};
const Map = (props: IMap) => {
  const mapContainerStyle = {
    display: "block",
    borderRadius: "10px",
    height: props.height ? props.height : "calc(100vh - 164px)",
    width: props.width
      ? props.width
      : window?.screen?.width > 600
      ? window?.screen?.width > 1200
        ? "100%"
        : "600px"
      : "calc(100vw - 24px)",
  };
  const { mapCenter, markers, setFocusedRestaurant } = props;
  // @ts-ignore
  const { isLoaded, loadError } = useJsApiLoader(scriptOptions);

  const mapRef: any = React.useRef();

  const onMapLoad = React.useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  if (!isLoaded) return <div>Loading...</div>;
  if (loadError) return <div>Error loading maps</div>;
  return (
    <GoogleMap
      id="map"
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={mapCenter}
      options={options}
      onLoad={onMapLoad}
    >
      <CustumCircle center={mapCenter} radius={props.radius} />
      {markers?.map((marker: any, i: number) => (
        <RestaurantMarker
          marker={marker}
          setFocusedRestaurant={setFocusedRestaurant}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
