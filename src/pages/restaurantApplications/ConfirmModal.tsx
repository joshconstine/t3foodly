import Dialog from "@mui/material/Dialog";
import { RestaurantApplication } from "@prisma/client";

interface IConfirmModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  restaurant: RestaurantApplication | null;
}
const ConfirmModal = (props: IConfirmModalProps) => {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <div>
        The folowing informatio was submitted and will be reviewed by an Foodly
        admin:
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
          <li>cuisineType: {props.restaurant?.cuisineType}</li>
        </ul>
        <div>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmModal;
