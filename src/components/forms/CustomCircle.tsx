import { Circle, LoadScript, useLoadScript } from "@react-google-maps/api";
import { useEffect } from "react";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_KEY
    ? process.env.NEXT_PUBLIC_PLACES_KEY
    : "",
  libraries: ["places"],
};
const CustumCircle = (props: {
  radius: number;
  center: { lat: number; lng: number };
}) => {
  //   const { isLoaded, loadError } = useLoadScript(scriptOptions);
  useEffect(() => {
    console.log("props", props);
  }, []);
  return (
    <Circle
      center={props.center}
      radius={1609 * props.radius}
      options={{
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.1,
      }}
    ></Circle>
  );
};

export default CustumCircle;
