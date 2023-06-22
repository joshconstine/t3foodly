import {
  Circle,
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React from "react";
import mapStyles from "../../styles/mapStyles";
import CustumCircle from "./CustomCircle";

const mapContainerStyle = {
  display: "block",
  height: "100%",
  width: "100%",
};
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
export interface IMarker {
  location: Point;
  name: string;
  id: string;
}
interface IMap {
  mapCenter: Point;
  markers: IMarker[];
  radius: number;
  setFocusedRestaurant: React.Dispatch<React.SetStateAction<string | null>>;
}

const Map = (props: IMap) => {
  const { mapCenter, markers, setFocusedRestaurant } = props;
  const [current, setCurrnet] = React.useState<number | null>(null);
  // @ts-ignore
  const { isLoaded, loadError } = useJsApiLoader(scriptOptions);

  const onMapClick = React.useCallback((e: any) => {
    // setMarkers((current: any) => [
    //   ...current,
    //   {
    //     lat: e.latLng.lat(),
    //     lng: e.latLng.lng(),
    //     time: new Date(),
    //   },
    // ]);
  }, []);

  const mapRef: any = React.useRef();

  const onMapLoad = React.useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }: any) => {
    mapRef?.current?.panTo({ lat, lng });
    mapRef?.current?.setZoom(14);
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
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      <CustumCircle center={mapCenter} radius={props.radius} />
      {markers?.map((marker: any, i: number) => (
        <Marker
          key={`${marker.location.lat}-${marker.location.lng}`}
          position={{ lat: marker.location.lat, lng: marker.location.lng }}
          onClick={() => {
            setFocusedRestaurant(String(marker.id));
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
