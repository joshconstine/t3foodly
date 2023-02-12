import { api } from "../../utils/api";

const AddRestaurantForm = () => {
  const createRestaurant =
    api.restaurantApplication.createRestaurantApplication.useMutation();
  const restaurantApplications = api.restaurantApplication.getAll.useQuery();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
    createRestaurant.mutate(
      {
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
      },
      {
        async onSuccess() {
          await restaurantApplications.refetch();
        },
      }
    );
  };

  return (
    <div>
      <div>Add Restaurant</div>
      <form onSubmit={handleSubmit} className="flex w-48 flex-col">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          className="bg-gray-200"
          placeholder="Restaurant name"
        ></input>{" "}
        <label>Address:</label>
        <input
          type="text"
          name="address"
          className="bg-gray-200"
          placeholder="Restaurant address"
        ></input>
        <label>City:</label>
        <input
          type="text"
          name="city"
          className="bg-gray-200"
          placeholder="city"
        ></input>
        <label>State:</label>
        <input
          type="text"
          name="state"
          className="bg-gray-200"
          placeholder="state"
        ></input>
        <label>Zip Code:</label>
        <input
          type="text"
          name="zipCode"
          className="bg-gray-200"
          placeholder="zipcode"
        ></input>{" "}
        <label>Cuisine Type:</label>
        <input
          type="text"
          name="cuisineType"
          className="bg-gray-200"
          placeholder="cuisine"
        ></input>
        <label>Email:</label>
        <input
          type="text"
          name="email"
          className="bg-gray-200"
          placeholder="email"
        ></input>{" "}
        <label>website:</label>
        <input
          type="text"
          name="website"
          className="bg-gray-200"
          placeholder="website"
        ></input>{" "}
        <label>Hours:</label>
        <input
          type="text"
          name="hoursInterval"
          className="bg-gray-200"
          placeholder="hours of operation"
        ></input>{" "}
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          className="bg-gray-200"
          placeholder="phone number"
        ></input>
        <button type="submit" className="bg-gray-200">
          Create Restaurant
        </button>
      </form>
    </div>
  );
};

export default AddRestaurantForm;
