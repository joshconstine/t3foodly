"use client";
import { Cuisine } from "@prisma/client";

interface IProps {
  cuisines: Cuisine[];
  selectedCuisines: Cuisine[];
  setCuisines: (cuisines: Cuisine[]) => void;
}
const CuisineFilter = (props: IProps) => {
  const { selectedCuisines, setCuisines } = props;
  return (
    <div className="flex w-full flex-wrap gap-4">
      {props?.cuisines?.map((cuisine) => {
        const handleClick = () => {
          if (selectedCuisines?.includes(cuisine))
            setCuisines(selectedCuisines?.filter((c) => c.id !== cuisine.id));
          else setCuisines([...selectedCuisines, cuisine]);
        };
        return (
          <div>
            <button
              onClick={handleClick}
              className={`rounded-full ${
                selectedCuisines?.includes(cuisine)
                  ? "bg-secondary text-white"
                  : "border-2 border-secondary "
              } p-2`}
            >
              {cuisine.name}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CuisineFilter;
