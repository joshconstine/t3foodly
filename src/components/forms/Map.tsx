import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import React from "react";
import mapStyles from "../../styles/mapStyles";

const mapContainerStyle = {
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

interface IMap {
  mapCenter: Point;
  markers: Point[];
}

const Map = (props: IMap) => {
  const { mapCenter, markers } = props;
  const [current, setCurrnet] = React.useState<number | null>(null);
  console.log("markers", markers);
  // @ts-ignore
  const { isLoaded, loadError } = useLoadScript(scriptOptions);

  const [selected, setSelected] = React.useState(null);
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
      zoom={8}
      center={mapCenter}
      options={options}
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      {markers?.map((marker: any, i: number) => (
        <>
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            onMouseOver={() => {
              // window.alert(`Mouse over ${i}`);
              setCurrnet(i);
            }}
            onMouseOut={() => {
              setCurrnet(null);
            }}
          />
          {current === i && (
            <InfoWindow position={{ lat: marker.lat, lng: marker.lng }}>
              <div>hello world</div>
            </InfoWindow>
          )}
        </>
      ))}
    </GoogleMap>
  );
};

export default Map;
