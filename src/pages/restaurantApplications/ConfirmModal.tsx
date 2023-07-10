import Dialog from "@mui/material/Dialog";
import { RestaurantApplication } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import MinimalRestaurantCard from "../../components/RestaurantCards/MinimalRestaurantCard";
import { api } from "../../utils/api";

interface IConfirmModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  restaurant: RestaurantApplication | null;
}
const ConfirmModal = (props: IConfirmModalProps) => {
  const { restaurant } = props;
  const [showError, setShowError] = useState(true);
  const router = useRouter();
  const handleClose = () => {
    props.setOpen(false);
    router.push("/restaurant");
  };

  const isCreated = api.restaurant.isCreated.useQuery({
    city: restaurant?.cityName || "666",
    state: restaurant?.stateName || "666",
    name: restaurant?.name || "666",
  });

  const deleteApplication = api.restaurantApplication.delete.useMutation();
  const handleDisregard = () => {
    setShowError(false);
  };
  const handleCancel = () => {
    if (restaurant?.id)
      deleteApplication.mutate({ applicationId: restaurant.id });
    handleClose();
  };

  return (
    <dialog
      open
      className="bg fixed inset-0 z-10 w-2/3 overflow-y-auto rounded-lg border-2 border-zinc-700 bg-gray-400"
    >
      {isCreated.data && isCreated.data[0] && showError ? (
        <div className="flex flex-col items-center gap-8">
          <p className="text-lg text-primary">{`Found another restaurant nammed ${props.restaurant?.name} in ${props.restaurant?.cityName}.`}</p>
          <MinimalRestaurantCard restaurant={isCreated.data[0]} />
          <div className="flex gap-8">
            <button
              className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
              onClick={handleCancel}
            >
              Cancel Application
            </button>
            <button
              className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
              onClick={handleDisregard}
            >
              Submit anyways
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          The folowing information was submitted and will be reviewed by an
          Foodley admin:
          <ul>
            <li>name: {props.restaurant?.name}</li>
            <li>status: {props.restaurant?.status}</li>
            <li>
              submitted: {props.restaurant?.created_at.toLocaleTimeString()}
            </li>

            <li>address: {props.restaurant?.address}</li>
            <li>city: {props.restaurant?.cityName}</li>
            <li>state: {props.restaurant?.stateName}</li>
            <li>zipCode: {props.restaurant?.zipCode}</li>
            <li>email: {props.restaurant?.email}</li>
            <li>phone: {props.restaurant?.phone}</li>
            <li>website: {props.restaurant?.website}</li>
            <li>hoursInterval: {props.restaurant?.hoursInterval}</li>
          </ul>
          <div>
            <button
              onClick={handleClose}
              className="rounded-lg bg-primary px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default ConfirmModal;
