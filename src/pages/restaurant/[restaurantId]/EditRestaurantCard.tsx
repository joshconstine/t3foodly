import { api } from "../../../utils/api";

interface IProps {
  restaurantId: string;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditRestaurantCard = (props: IProps) => {
  const { restaurantId, setEditMode } = props;
  const restaurant = api.restaurant.getById.useQuery({ id: restaurantId });
  const updateRestaurant = api.restaurant.updateRestaurant.useMutation();

  const handleUpdate = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      name: { value: string };
      address: { value: string };
      city: { value: string };
      state: { value: string };
      zipCode: { value: string };
      cuisineType: { value: string };
      email: { value: string };
      website: { value: string };
      phone: { value: string };
      hoursInterval: { value: string };
    };
    if (restaurant?.data)
      updateRestaurant.mutate(
        {
          id: String(restaurantId),
          name: formElements.name.value,
          address: formElements.address.value,
          cityName: formElements.city.value,
          stateName: formElements.state.value,
          zipCode: formElements.zipCode.value,
          email: formElements.email.value,
          phone: formElements.phone.value,
          website: formElements.website.value,
          hoursInterval: formElements.hoursInterval.value,
          cuisineType: formElements.cuisineType.value,
          lat: Number(restaurant.data.lat),
          lng: Number(restaurant.data.lng),
        },
        {
          async onSuccess() {
            await restaurant.refetch();
            // setEditMode(false);
          },
        }
      );
  };
  return (
    <div>
      <h1>Edit Restaurant Card</h1>
      <div className=" m-4 p-4">
        <h1 className="text-2xl text-primary">Current Restaurant Data</h1>
        <p>Restaurant ID: {restaurantId}</p>
        <p>Restaurant Name: {restaurant.data?.name}</p>
        <p>Restaurant Address: {restaurant.data?.address}</p>
        <p>Restaurant City: {restaurant.data?.cityName}</p>
        <p>Restaurant State: {restaurant.data?.stateName}</p>
        <p>Restaurant Zip: {restaurant.data?.zipCode}</p>
        <p>Restaurant Phone: {restaurant.data?.phone}</p>
        <p>Restaurant Website: {restaurant.data?.website}</p>
        <p>Restaurant Hours: {restaurant.data?.hoursInterval}</p>
        <p>Restaurant Lat: {restaurant.data?.lat}</p>
        <p>Restaurant Lng: {restaurant.data?.lng}</p>
      </div>
      <form
        onSubmit={handleUpdate}
        className="m-4 flex w-64 flex-col  whitespace-nowrap p-4"
      >
        <h1 className="text-2xl text-primary">Update Restaurant Data</h1>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          className="bg-gray-200"
          placeholder="Restaurant name"
          defaultValue={restaurant?.data?.name}
        ></input>{" "}
        <label>Address:</label>
        <input
          type="text"
          name="address"
          className="bg-gray-200"
          placeholder="Restaurant address"
          defaultValue={
            restaurant?.data?.address ? restaurant?.data?.address : ""
          }
        ></input>
        <label>City:</label>
        <input
          type="text"
          name="city"
          className="bg-gray-200"
          placeholder="city"
          defaultValue={restaurant?.data?.cityName}
        ></input>
        <label>State:</label>
        <input
          type="text"
          name="state"
          className="bg-gray-200"
          placeholder="state"
          defaultValue={restaurant?.data?.stateName}
        ></input>
        <label>Zip Code:</label>
        <input
          type="text"
          name="zipCode"
          className="bg-gray-200"
          placeholder="zipcode"
          defaultValue={restaurant?.data?.zipCode}
        ></input>{" "}
        <label>Cuisine Type:</label>
        <input
          type="text"
          name="cuisineType"
          className="bg-gray-200"
          placeholder="cuisine"
          defaultValue={
            restaurant?.data?.cuisineType ? restaurant.data.cuisineType : ""
          }
        ></input>{" "}
        <label>Email:</label>
        <input
          type="text"
          name="email"
          className="bg-gray-200"
          placeholder="email"
          defaultValue={restaurant?.data?.email ? restaurant.data.email : ""}
        ></input>{" "}
        <label>website:</label>
        <input
          type="text"
          name="website"
          className="bg-gray-200"
          placeholder="website"
          defaultValue={
            restaurant?.data?.website ? restaurant.data.website : ""
          }
        ></input>{" "}
        <label>Hours:</label>
        <input
          type="text"
          name="hoursInterval"
          className="bg-gray-200"
          placeholder="hours of operation"
          defaultValue={
            restaurant?.data?.hoursInterval ? restaurant.data.hoursInterval : ""
          }
        ></input>{" "}
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          className="bg-gray-200"
          placeholder="phone number"
          defaultValue={restaurant?.data?.phone ? restaurant.data.phone : ""}
        ></input>
        <button
          className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
          type="submit"
        >
          save
        </button>
        <button
          type="button"
          className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
          onClick={() => {
            setEditMode(false);
          }}
        >
          close
        </button>
      </form>
    </div>
  );
};

export default EditRestaurantCard;
