import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const cuisines = [
  "American",
  "Asian",
  "Barbecue",
  "Burgers",
  "Cajun",
  "Caribbean",
  "Chinese",
  "Deli",
  "Desserts",
  "Fast Food",
  "French",
  "Greek",
  "Indian",
  "Italian",
  "Japanese",
  "Korean",
];
interface ICuisineContainerProps {
  setCuisines: (cuisines: string) => void;
}

const CuisineContainer = (props: ICuisineContainerProps) => {
  const { setCuisines } = props;
  const [selectedCuisines, setSelectedCuisines] = useState<boolean[]>(
    Array(cuisines.length).fill(false)
  );
  useEffect(() => {
    setCuisines(
      cuisines.filter((cuisine, i) => selectedCuisines[i]).join(", ")
    );
  }, [selectedCuisines]);
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        className={`rounded-full border-2 border-secondary bg-white p-2 text-secondary `}
        onClick={() => {
          setSelectedCuisines(Array(cuisines.length).fill(false));
        }}
      >
        Clear
      </motion.button>
      <div className="flex h-full w-full flex-wrap gap-4">
        {cuisines.map((cuisine, i) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            className={`rounded-full border-2 border-primary ${
              !selectedCuisines[i]
                ? "bg-white text-primary"
                : "bg-primary text-white"
            } p-2   `}
            key={cuisine}
            onClick={() => {
              const newSelectedCuisines = [...selectedCuisines];
              newSelectedCuisines[i] = !newSelectedCuisines[i];
              setSelectedCuisines(newSelectedCuisines);
            }}
          >
            {cuisine}
          </motion.button>
        ))}
      </div>
    </>
  );
};

export default CuisineContainer;
