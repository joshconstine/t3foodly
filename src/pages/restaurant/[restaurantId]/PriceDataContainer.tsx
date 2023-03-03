import { IPriceData } from ".";

interface IPriceDataContainerProps {
  priceData: IPriceData | null;
  setPriceData: (priceData: IPriceData) => void;
}

interface IOrderOtion {
  name: string;
}
const orderOptions: IOrderOtion[] = [
  {
    name: "appetizer",
  },
  {
    name: "entree",
  },
  {
    name: "dessert",
  },
  {
    name: "drink",
  },
];

const PriceDataContainer = (props: IPriceDataContainerProps) => {
  return (
    <div>
      PriceDataContainer
      <form>
        <label>Total Price</label>
        <input className="bg-gray-200" type="numeric"></input>
        <button type="submit" className=" rounded-sm bg-slate-400">
          Submit
        </button>
      </form>
      {orderOptions.map((option, index) => {
        const handleIncrement = () => {
          if (props.priceData) {
            if (
              !props.priceData.order.find((order) => order.name === option.name)
            ) {
              const newPriceData = {
                ...props.priceData,
                order: [
                  ...props?.priceData?.order,
                  { name: option.name, quantity: 1 },
                ],
              };
              props.setPriceData(newPriceData);
              return;
            }
            const newPriceData = {
              ...props.priceData,
              order:
                props?.priceData?.order?.map((order) => {
                  if (order.name === option.name) {
                    return {
                      ...order,
                      quantity: order.quantity + 1,
                    };
                  }
                  return order;
                }) || [],
            };
            props.setPriceData(newPriceData);
          } else {
            props.setPriceData({
              price: 0,
              order: [
                {
                  name: option.name,
                  quantity: 1,
                },
              ],
            });
          }
        };
        const handleDecremnet = () => {
          if (props.priceData) {
            const newPriceData = {
              ...props.priceData,
              order: props?.priceData?.order.find(
                (order) => order.name === option.name
              )
                ? props?.priceData?.order?.map((order) => {
                    if (order.name === option.name) {
                      return {
                        ...order,
                        quantity: order.quantity - 1,
                      };
                    }
                    return order;
                  })
                : [
                    ...props.priceData?.order,
                    { name: option.name, quantity: 1 },
                  ],
            };
            props.setPriceData(newPriceData);
          }
        };

        return (
          <div key={index}>
            <h1>{option.name}</h1>
            {
              props?.priceData?.order?.find(
                (order) => order.name === option.name
              )?.quantity
            }
            <button
              className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
              onClick={handleIncrement}
            >
              +
            </button>
            <button
              className={`rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700 ${
                !props?.priceData?.order?.find(
                  (order) => order.name === option.name
                )?.quantity
                  ? "hidden"
                  : ""
              }`}
              onClick={handleDecremnet}
            >
              -
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PriceDataContainer;
